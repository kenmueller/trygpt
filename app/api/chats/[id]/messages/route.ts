if (!process.env.OPENAI_API_KEY) throw new Error('Missing OPENAI_API_KEY')
if (!process.env.OPENAI_MODEL) throw new Error('Missing OPENAI_MODEL')

import { NextRequest, NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'
import userFromRequest from '@/lib/user/fromRequest'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import createChatMessage from '@/lib/chat/message/create'
import isChatOwnedByUser from '@/lib/chat/isOwnedByUser'
import createChatCompletion from '@/lib/createChatCompletion'
import chatMessagesFromChatId from '@/lib/chat/message/fromChatId'

export const revalidate = 0
export const dynamic = 'force-dynamic'

const encoder = new TextEncoder()

export const POST = async (
	request: NextRequest,
	{ params: { id } }: { params: { id: string } }
) => {
	try {
		const chatId = decodeURIComponent(id)

		const user = await userFromRequest()
		if (!user) throw new HttpError(ErrorCode.Unauthorized, 'Unauthorized')

		if (!isChatOwnedByUser(chatId, user.id))
			throw new HttpError(ErrorCode.Forbidden, 'You do not own this chat')

		const text = (await request.text()).trim()
		if (!text) throw new HttpError(ErrorCode.BadRequest, 'No text')

		const previousMessages = await chatMessagesFromChatId(chatId)

		await createChatMessage({ chatId, role: 'user', text })

		const iterator = createChatCompletion([
			...previousMessages,
			{ role: 'user', text }
		])

		let responseText = ''

		return new NextResponse(
			new ReadableStream<Uint8Array>({
				pull: async controller => {
					const { value, done } = await iterator.next()

					console.log(value)

					if (!done) {
						controller.enqueue(encoder.encode(value))
						responseText += value

						return
					}

					await createChatMessage({
						chatId,
						role: 'assistant',
						text: responseText
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
