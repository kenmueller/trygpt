if (!process.env.NEXT_PUBLIC_PREVIEW_MESSAGE_LIMIT)
	throw new Error('Missing NEXT_PUBLIC_PREVIEW_MESSAGE_LIMIT')

import { NextRequest, NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'
import userFromRequest from '@/lib/user/fromRequest'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import createChatMessages, {
	CreateChatMessageData
} from '@/lib/chat/message/create'
import isChatOwnedByUser from '@/lib/chat/isOwnedByUser'
import createChatCompletion, {
	ChatCompletionMessage
} from '@/lib/completion/chat'
import chatMessagesFromChatId from '@/lib/chat/message/fromChatId'
import updateUser from '@/lib/user/update'
import getTokens from '@/lib/getTokens'
import updateChat from '@/lib/chat/update'
import formatCents from '@/lib/cents/format'
import { messagePromptMessages } from '@/lib/promptMessages'

export const dynamic = 'force-dynamic'

export const GET = async (
	_request: NextRequest,
	{ params: { chatId: encodedChatId } }: { params: { chatId: string } }
) => {
	try {
		const chatId = decodeURIComponent(encodedChatId)
		return NextResponse.json(await chatMessagesFromChatId(chatId))
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}

const encoder = new TextEncoder()

export const POST = async (
	request: NextRequest,
	{ params: { chatId: encodedChatId } }: { params: { chatId: string } }
) => {
	try {
		const chatId = decodeURIComponent(encodedChatId)

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

		if (!(await isChatOwnedByUser(chatId, user.id)))
			throw new HttpError(ErrorCode.Forbidden, 'You do not own this chat')

		const inputMessages: ChatCompletionMessage[] = await request.json()
		if (
			!(
				Array.isArray(inputMessages) &&
				inputMessages.every(
					message =>
						typeof message === 'object' &&
						message &&
						['user', 'assistant'].includes(message.role) &&
						typeof message.text === 'string' &&
						message.text
				)
			)
		)
			throw new HttpError(ErrorCode.BadRequest, 'Invalid messages')

		const previousMessages = await chatMessagesFromChatId(chatId)
		const newMessages: CreateChatMessageData[] = inputMessages.map(
			({ role, text }) => ({ chatId, role, text })
		)

		const promptMessages = messagePromptMessages([
			...previousMessages,
			...newMessages
		])

		await createChatMessages(newMessages)

		if (preview)
			// Increment preview messages before creating the chat completion so a user can't get tons of free messages by spamming the endpoint
			await updateUser(user.id, {
				incrementPreviewMessages: 1
			})

		const chatCompletion = createChatCompletion({
			messages: promptMessages,
			preview,
			stream: true
		})

		let responseText = ''

		return new NextResponse(
			new ReadableStream<Uint8Array>({
				pull: async controller => {
					const { value, done } = await chatCompletion.next()

					if (!done) {
						controller.enqueue(encoder.encode(value))
						responseText += value

						return
					}

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

					controller.close()
				}
			})
		)
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
