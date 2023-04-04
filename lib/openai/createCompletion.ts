import 'server-only'

if (!process.env.OPENAI_MODEL) throw new Error('Missing OPENAI_MODEL')

import { AxiosError } from 'axios'

import openai from '.'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import ChatMessage from '@/lib/chat/message'

interface StreamResponse {
	status: number
	data: {
		on(event: 'data', listener: (data: Buffer) => void): void
	}
}

const createCompletion = async (
	messages: Pick<ChatMessage, 'role' | 'text'>[],
	onChunk: (chunk: string) => void
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

	return new Promise<string>((resolve, reject) => {
		try {
			let result = ''

			response.data.on('data', data => {
				const lines = data
					.toString()
					.split('\n')
					.filter(line => line.trim())

				for (const line of lines) {
					const message = line.replace(/^data:\s/, '')

					if (message === '[DONE]') {
						resolve(result)
						return
					}

					try {
						const parsed = JSON.parse(message)
						const chunk = parsed.choices[0].delta.content ?? ''

						onChunk(chunk)
						result += chunk
					} catch (unknownError) {
						console.error(unknownError)
					}
				}
			})
		} catch (unknownError) {
			const error = unknownError as AxiosError
			const response = error.response as unknown as StreamResponse | undefined

			if (!response) {
				reject(
					new HttpError(
						ErrorCode.Internal,
						'An unknown error occurred streaming the response'
					)
				)
				return
			}

			response.data.on('data', data => {
				reject(new HttpError(ErrorCode.Internal, data.toString()))
			})
		}
	})
}

export default createCompletion
