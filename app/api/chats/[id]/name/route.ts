import { NextRequest, NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'
import userFromRequest from '@/lib/user/fromRequest'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import isChatOwnedByUser from '@/lib/chat/isOwnedByUser'
import createChatCompletion, {
	ChatCompletionMessage
} from '@/lib/createChatCompletion'
import updateChat from '@/lib/chat/update'
import trimQuotes from '@/lib/trimQuotes'
import updateUser from '@/lib/user/update'
import getTokens from '@/lib/getTokens'

export const dynamic = 'force-dynamic'

const encoder = new TextEncoder()

const systemMessages: ChatCompletionMessage[] = [
	{
		role: 'system',
		text: 'Do not surround your response in quotes. Write a maximum of 15 words.'
	}
]

interface UpdateChatNameData {
	type: 'prompt' | 'value'
	value: string
}

export const PATCH = async (
	request: NextRequest,
	{ params: { id: encodedChatId } }: { params: { id: string } }
) => {
	try {
		const chatId = decodeURIComponent(encodedChatId)

		if (request.headers.get('content-type') !== 'application/json')
			throw new HttpError(ErrorCode.BadRequest, 'Invalid content type')

		const user = await userFromRequest()
		if (!user) throw new HttpError(ErrorCode.Unauthorized, 'Unauthorized')

		if (!user.purchasedAmount)
			throw new HttpError(ErrorCode.Forbidden, 'You have no tokens')

		if (!(await isChatOwnedByUser(chatId, user.id)))
			throw new HttpError(ErrorCode.Forbidden, 'You do not own this chat')

		const data: UpdateChatNameData = await request.json()

		if (
			!(
				typeof data === 'object' &&
				data &&
				['prompt', 'value'].includes(data.type) &&
				typeof data.value === 'string' &&
				data.value
			)
		)
			throw new HttpError(ErrorCode.BadRequest, 'Invalid data')

		switch (data.type) {
			case 'prompt': {
				const requestMessages: ChatCompletionMessage[] = [
					...systemMessages,
					{
						role: 'user',
						text: `Generate a short title for a conversation starting with this prompt: ${data.value}`
					}
				]

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

							const responseMessage: ChatCompletionMessage = {
								role: 'assistant',
								text: responseText
							}

							await Promise.all([
								updateChat(chatId, {
									name: trimQuotes(responseText),
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
			}
			case 'value': {
				await updateChat(chatId, {
					name: data.value,
					updated: 'now'
				})

				return new NextResponse('')
			}
		}
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
