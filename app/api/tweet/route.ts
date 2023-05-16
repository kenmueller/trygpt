if (!process.env.NEXT_PUBLIC_PREVIEW_MESSAGE_LIMIT)
	throw new Error('Missing NEXT_PUBLIC_PREVIEW_MESSAGE_LIMIT')

import { NextRequest, NextResponse } from 'next/server'
import omit from 'lodash/omit'

import errorFromUnknown from '@/lib/error/fromUnknown'
import userFromRequest from '@/lib/user/fromRequest'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import createConversation from '@/lib/conversation/create'
import { conversationsIndex } from '@/lib/algolia'
import conversationFromIdWithoutPointData from '@/lib/conversation/fromIdWithoutPointData'
import truncate from '@/lib/truncate'
import formatCents from '@/lib/cents/format'
import createChat from '@/lib/chat/create'
import createChatCompletion, {
	ChatCompletionMessage
} from '@/lib/createChatCompletion'
import { messagePromptMessages, namePromptMessages } from '@/lib/promptMessages'
import updateChat from '@/lib/chat/update'
import trimQuotes from '@/lib/trimQuotes'
import updateUser from '@/lib/user/update'
import getTokens from '@/lib/getTokens'
import createChatMessages, {
	CreateChatMessageData
} from '@/lib/chat/message/create'
import ORIGIN from '@/lib/origin'
import mdToText from '@/lib/md/toText'

export const dynamic = 'force-dynamic'

const TWEET_LENGTH = 280

interface CreateTweetData {
	name: string | null
	prompt: string
}

export const POST = async (request: NextRequest) => {
	try {
		if (request.headers.get('content-type') !== 'application/json')
			throw new HttpError(ErrorCode.BadRequest, 'Invalid content type')

		const user = await userFromRequest()
		if (!user) throw new HttpError(ErrorCode.Unauthorized, 'Unauthorized')

		const preview = !user.paymentMethod

		const hasPreviewMessagesRemaining =
			user.previewMessages <
			Number.parseInt(process.env.NEXT_PUBLIC_PREVIEW_MESSAGE_LIMIT!)

		if (preview && !hasPreviewMessagesRemaining)
			throw new HttpError(
				ErrorCode.Forbidden,
				`You have no free messages remaining. Purchase GPT 4 for ${formatCents(
					100
				)} to continue.`
			)

		const data: CreateTweetData = await request.json()

		if (
			!(
				typeof data === 'object' &&
				data &&
				(typeof data.name === 'string' || data.name === null) &&
				typeof data.prompt === 'string' &&
				data.prompt
			)
		)
			throw new HttpError(ErrorCode.BadRequest, 'Invalid data')

		data.name ||= null
		data.name = truncate(data.name, 150)

		const chatId = await createChat(user, {
			original: null,
			name: data.name
		})

		const completionPromises = [
			data.name ??
				(async () => {
					const promptMessages: ChatCompletionMessage[] = namePromptMessages(
						data.prompt
					)

					const responseText = await createChatCompletion({
						messages: promptMessages,
						preview,
						stream: false
					})

					const responseMessage: ChatCompletionMessage = {
						role: 'assistant',
						text: responseText
					}

					const name = truncate(trimQuotes(responseText), 150)

					const promises = [
						updateChat(chatId, {
							name,
							updated: 'now'
						})
					]

					if (!preview)
						promises.push(
							updateUser(user.id, {
								incrementPromptTokens: getTokens(promptMessages),
								incrementCompletionTokens: getTokens([responseMessage])
							})
						)

					await Promise.all(promises)

					return name
				})(),
			(async () => {
				const newMessages: CreateChatMessageData[] = [
					{
						chatId,
						role: 'user',
						text: data.prompt
					}
				]

				const promptMessages = messagePromptMessages(newMessages)

				await createChatMessages(newMessages)

				if (preview)
					// Increment preview messages before creating the chat completion so a user can't get tons of free messages by spamming the endpoint
					await updateUser(user.id, {
						incrementPreviewMessages: 1
					})

				const responseText = await createChatCompletion({
					messages: promptMessages,
					preview,
					stream: false
				})

				const completionMessage: CreateChatMessageData = {
					chatId,
					role: 'assistant',
					text: responseText
				}

				const promises = [
					createChatMessages([completionMessage]),
					updateChat(chatId, { updated: 'now' })
				]

				if (!preview)
					promises.push(
						updateUser(user.id, {
							incrementPromptTokens: getTokens(promptMessages),
							incrementCompletionTokens: getTokens([completionMessage])
						})
					)

				await Promise.all(promises)

				return responseText
			})()
		] as const

		const [chatName, responseText] = await Promise.all(completionPromises)

		const { id: conversationId } = await createConversation(user, {
			chatId,
			chatName,
			title: '',
			text: ''
		})

		const conversation = await conversationFromIdWithoutPointData(
			conversationId
		)

		if (!conversation)
			throw new HttpError(ErrorCode.Internal, 'Conversation not found')

		await conversationsIndex.saveObject({
			objectID: conversation.id,
			...omit(conversation, ['id'])
		})

		const shortenedConversationUrl = new URL(
			`/c/${encodeURIComponent(conversation.id)}`,
			ORIGIN
		)

		const prefix = data.name ? `${data.name} ` : ''
		const suffix = ` ${shortenedConversationUrl.href}`

		const text = `${prefix}${truncate(
			mdToText(responseText),
			TWEET_LENGTH - (prefix.length + suffix.length),
			true
		)}${suffix}`

		return NextResponse.json({
			text,
			conversationId: conversation.id,
			conversationSlug: conversation.slug
		})
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
