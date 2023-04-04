import 'server-only'

if (!process.env.OPENAI_MODEL) throw new Error('Missing OPENAI_MODEL')

import { AxiosError } from 'axios'

import openai from '.'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import ChatMessage from '@/lib/chat/message'
import callbackToAsyncIterator, {
	AsyncIteratorCallbackData
} from '../callbackToAsyncIterator'

interface StreamResponse {
	data: {
		on(event: 'data', listener: (data: Buffer) => void): void
	}
}

interface ParsedMessage {
	choices: [{ delta: { content?: string } }]
}

const createCompletionWithCallback = async (
	messages: Pick<ChatMessage, 'role' | 'text'>[],
	callback: (data: AsyncIteratorCallbackData<string>) => void
) => {
	const response = (await openai.createChatCompletion(
		{
			model: process.env.OPENAI_MODEL!,
			messages: messages.map(({ role, text }) => ({ role, content: text })),
			temperature: 0.3,
			stream: true
		},
		{ responseType: 'stream' }
	)) as unknown as StreamResponse

	try {
		response.data.on('data', data => {
			const lines = data
				.toString()
				.split('\n')
				.filter(line => line.trim())

			for (const line of lines) {
				const message = line.replace(/^data:\s/, '')

				if (message === '[DONE]') {
					callback({ value: undefined, done: true })
					break
				}

				try {
					const parsed: ParsedMessage = JSON.parse(message)

					const chunk = parsed.choices[0].delta.content ?? ''
					if (!chunk) continue

					callback({ value: chunk, done: false })
				} catch (unknownError) {
					console.error(unknownError)
				}
			}
		})
	} catch (unknownError) {
		const error = unknownError as AxiosError
		const response = error.response as unknown as StreamResponse | undefined

		if (!response) {
			callback({
				error: new HttpError(
					ErrorCode.Internal,
					'An unknown error occurred streaming the response'
				)
			})
			return
		}

		response.data.on('data', data => {
			callback({
				error: new HttpError(ErrorCode.Internal, data.toString())
			})
		})
	}
}

const createCompletion = callbackToAsyncIterator(createCompletionWithCallback)

export default createCompletion
