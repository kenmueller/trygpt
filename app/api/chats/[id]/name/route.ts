if (!process.env.CHAT_NAME_OPENAI_MODEL)
	throw new Error('Missing CHAT_NAME_OPENAI_MODEL')

import { NextRequest, NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'
import userFromRequest from '@/lib/user/fromRequest'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import isChatOwnedByUser from '@/lib/chat/isOwnedByUser'
import createChatCompletion from '@/lib/createChatCompletion'
import updateChatName from '@/lib/chat/updateName'
import trimQuotes from '@/lib/trimQuotes'

export const revalidate = 0
export const dynamic = 'force-dynamic'

const encoder = new TextEncoder()

export const PATCH = async (
	request: NextRequest,
	{ params: { id: encodedChatId } }: { params: { id: string } }
) => {
	try {
		const chatId = decodeURIComponent(encodedChatId)

		const user = await userFromRequest()
		if (!user) throw new HttpError(ErrorCode.Unauthorized, 'Unauthorized')

		if (!isChatOwnedByUser(chatId, user.id))
			throw new HttpError(ErrorCode.Forbidden, 'You do not own this chat')

		const prompt = (await request.text()).trim()
		if (!prompt) throw new HttpError(ErrorCode.BadRequest, 'No prompt')

		const iterator = createChatCompletion({
			model: process.env.CHAT_NAME_OPENAI_MODEL!,
			messages: [
				{
					role: 'user',
					text: `Generate a short title for a conversation starting with this prompt: ${prompt}. Do not surround in quotes.`
				}
			]
		})

		let responseText = ''

		return new NextResponse(
			new ReadableStream<Uint8Array>({
				pull: async controller => {
					const { value, done } = await iterator.next()

					if (!done) {
						controller.enqueue(encoder.encode(value))
						responseText += value

						return
					}

					await updateChatName(chatId, trimQuotes(responseText))

					controller.close()
				}
			})
		)
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
