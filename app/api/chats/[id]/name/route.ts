import { NextRequest, NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'
import userFromRequest from '@/lib/user/fromRequest'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import isChatOwnedByUser from '@/lib/chat/isOwnedByUser'
import createChatCompletion, {
	ChatCompletionMessage
} from '@/lib/createChatCompletion'
import updateChatName from '@/lib/chat/updateName'
import trimQuotes from '@/lib/trimQuotes'
import updateUser from '@/lib/user/update'
import getTokens from '@/lib/getTokens'

export const revalidate = 0
export const dynamic = 'force-dynamic'

const encoder = new TextEncoder()

const systemMessages: ChatCompletionMessage[] = [
	{
		role: 'system',
		text: 'Do not surround your response in quotes'
	}
]

export const PATCH = async (
	request: NextRequest,
	{ params: { id: encodedChatId } }: { params: { id: string } }
) => {
	try {
		const chatId = decodeURIComponent(encodedChatId)

		const user = await userFromRequest()
		if (!user) throw new HttpError(ErrorCode.Unauthorized, 'Unauthorized')

		if (!user.purchasedTokens)
			throw new HttpError(ErrorCode.Forbidden, 'You have no tokens')

		if (!(await isChatOwnedByUser(chatId, user.id)))
			throw new HttpError(ErrorCode.Forbidden, 'You do not own this chat')

		const prompt = (await request.text()).trim()
		if (!prompt) throw new HttpError(ErrorCode.BadRequest, 'No prompt')

		const messages: ChatCompletionMessage[] = [
			...systemMessages,
			{
				role: 'user',
				text: `Generate a short title for a conversation starting with this prompt: ${prompt}`
			}
		]

		const chatCompletion = createChatCompletion(messages)

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

					const responseMessage: ChatCompletionMessage = {
						role: 'assistant',
						text: responseText
					}

					messages.push(responseMessage)

					await updateChatName(chatId, trimQuotes(responseText))

					await updateUser(user.id, {
						incrementTotalTokens: getTokens(messages)
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
