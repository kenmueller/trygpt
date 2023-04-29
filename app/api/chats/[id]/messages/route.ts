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
} from '@/lib/createChatCompletion'
import chatMessagesFromChatId from '@/lib/chat/message/fromChatId'
import updateUser from '@/lib/user/update'
import getTokens from '@/lib/getTokens'
import updateChat from '@/lib/chat/update'
import formatCents from '@/lib/cents/format'

export const dynamic = 'force-dynamic'

const encoder = new TextEncoder()

const systemMessages: ChatCompletionMessage[] = [
	{
		role: 'system',
		text: '\
Surround code in backticks and provide a language. \
Surround display mode math in \\[ and \\] and inline math in \\( and \\) and format as LaTeX. \
Format everything else as markdown. \
If asked to generate an image, output a markdown image with the URL "https://source.unsplash.com/1600x900/?{query}" with a detailed query and do not surround it in a code block.\
'
	}
]

export const POST = async (
	request: NextRequest,
	{ params: { id: encodedChatId } }: { params: { id: string } }
) => {
	try {
		const chatId = decodeURIComponent(encodedChatId)

		if (request.headers.get('content-type') !== 'application/json')
			throw new HttpError(ErrorCode.BadRequest, 'Invalid content type')

		const user = await userFromRequest()
		if (!user) throw new HttpError(ErrorCode.Unauthorized, 'Unauthorized')

		const preview = !user.purchasedAmount

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

		const requestMessages = [
			...systemMessages,
			...previousMessages,
			...newMessages
		]

		await createChatMessages(newMessages)

		if (preview)
			// Increment preview messages before creating the chat completion so a user can't get tons of free messages by spamming the endpoint
			await updateUser(user.id, {
				incrementPreviewMessages: 1
			})

		const chatCompletion = createChatCompletion(requestMessages, preview)

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

					const responseMessage: CreateChatMessageData = {
						chatId,
						role: 'assistant',
						text: responseText
					}

					await Promise.all([
						createChatMessages([responseMessage]),
						updateChat(chatId, {
							updated: 'now'
						}),
						updateUser(user.id, {
							incrementRequestTokens: getTokens(requestMessages),
							incrementResponseTokens: getTokens([responseMessage])
						})
					])

					controller.close()
				}
			})
		)
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
