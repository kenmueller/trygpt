if (!process.env.NEXT_PUBLIC_PREVIEW_MESSAGE_LIMIT)
	throw new Error('Missing NEXT_PUBLIC_PREVIEW_MESSAGE_LIMIT')

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
import formatCents from '@/lib/cents/format'
import truncate from '@/lib/truncate'
import { namePromptMessages } from '@/lib/promptMessages'

export const dynamic = 'force-dynamic'

const encoder = new TextEncoder()

interface UpdateChatNameData {
	type: 'prompt' | 'value'
	value: string
}

export const PATCH = async (
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
				const promptMessages: ChatCompletionMessage[] = namePromptMessages(
					data.value
				)

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

							const responseMessage: ChatCompletionMessage = {
								role: 'assistant',
								text: responseText
							}

							const promises = [
								updateChat(chatId, {
									name: truncate(trimQuotes(responseText), 150),
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

							controller.close()
						}
					})
				)
			}
			case 'value': {
				await updateChat(chatId, {
					name: truncate(data.value, 150),
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
