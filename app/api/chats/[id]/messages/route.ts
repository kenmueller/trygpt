import { NextRequest, NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'
import userFromRequest from '@/lib/user/fromRequest'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import createChatMessage, {
	CreateChatMessageData
} from '@/lib/chat/message/create'
import isChatOwnedByUser from '@/lib/chat/isOwnedByUser'
import createChatCompletion, {
	ChatCompletionMessage
} from '@/lib/createChatCompletion'
import chatMessagesFromChatId from '@/lib/chat/message/fromChatId'
import updateUser from '@/lib/user/update'
import getTokens from '@/lib/getTokens'

export const dynamic = 'force-dynamic'

const encoder = new TextEncoder()

const systemMessages: ChatCompletionMessage[] = [
	{
		role: 'system',
		text: 'Surround your code in backticks and provide a language'
	}
]

export const POST = async (
	request: NextRequest,
	{ params: { id: encodedChatId } }: { params: { id: string } }
) => {
	try {
		const chatId = decodeURIComponent(encodedChatId)

		const user = await userFromRequest()
		if (!user) throw new HttpError(ErrorCode.Unauthorized, 'Unauthorized')

		if (!user.purchasedAmount)
			throw new HttpError(ErrorCode.Forbidden, 'You have no tokens')

		if (!(await isChatOwnedByUser(chatId, user.id)))
			throw new HttpError(ErrorCode.Forbidden, 'You do not own this chat')

		const text = (await request.text()).trim()
		if (!text) throw new HttpError(ErrorCode.BadRequest, 'No text')

		const previousMessages = await chatMessagesFromChatId(chatId)
		const userMessage: CreateChatMessageData = { chatId, role: 'user', text }

		const requestMessages = [
			...systemMessages,
			...previousMessages,
			userMessage
		]

		await createChatMessage(userMessage)

		const chatCompletion = createChatCompletion(requestMessages)

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

					await createChatMessage(responseMessage)

					await updateUser(user.id, {
						incrementRequestTokens: getTokens(requestMessages),
						incrementResponseTokens: getTokens([responseMessage])
					})

					controller.close()
				}
			})
		)
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
