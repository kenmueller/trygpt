import 'server-only'

if (!process.env.OPENAI_API_KEY) throw new Error('Missing OPENAI_API_KEY')
if (!process.env.NEXT_PUBLIC_PREVIEW_OPENAI_MODEL)
	throw new Error('Missing NEXT_PUBLIC_PREVIEW_OPENAI_MODEL')
if (!process.env.NEXT_PUBLIC_OPENAI_MODEL)
	throw new Error('Missing NEXT_PUBLIC_OPENAI_MODEL')

import ChatMessage from '@/lib/chat/message'
import responseToGenerator from './responseToGenerator'
import errorFromResponse from './error/fromResponse'

export type ChatCompletionMessage = Pick<ChatMessage, 'role' | 'text'>

export interface CreateChatCompletion {
	(options: {
		messages: ChatCompletionMessage[]
		preview: boolean
		stream: true
	}): AsyncGenerator<string, void, unknown>
	(options: {
		messages: ChatCompletionMessage[]
		preview: boolean
		stream: false
	}): Promise<string>
}

const createChatCompletion = (({ messages, preview, stream }) => {
	const model = preview
		? process.env.NEXT_PUBLIC_PREVIEW_OPENAI_MODEL!
		: process.env.NEXT_PUBLIC_OPENAI_MODEL!

	return (stream ? createChatCompletionStream : createChatCompletionWait)(
		model,
		messages
	)
}) as CreateChatCompletion

interface ParsedDeltaMessage {
	choices: [{ delta: { content?: string } }]
}

const createChatCompletionStream = async function* (
	model: string,
	messages: ChatCompletionMessage[]
) {
	const response = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			authorization: `Bearer ${process.env.OPENAI_API_KEY!}`
		},
		body: JSON.stringify({
			model,
			messages: messages.map(({ role, text }) => ({ role, content: text })),
			stream: true
		})
	})

	for await (const chunk of responseToGenerator(response)) {
		const lines = chunk.split('\n').filter(line => line.trim())

		for (const line of lines) {
			const message = line.replace(/^data:\s/, '')
			if (message === '[DONE]') return

			try {
				const parsed: ParsedDeltaMessage = JSON.parse(message)

				const chunk = parsed.choices[0].delta.content
				if (!chunk) continue

				yield chunk
			} catch (unknownError) {
				console.error(unknownError)
			}
		}
	}
}

interface ParsedCompleteMessage {
	choices: [{ text: string }]
}

const createChatCompletionWait = async (
	model: string,
	messages: ChatCompletionMessage[]
) => {
	const response = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			authorization: `Bearer ${process.env.OPENAI_API_KEY!}`
		},
		body: JSON.stringify({
			model,
			messages: messages.map(({ role, text }) => ({ role, content: text }))
		})
	})

	if (!response.ok) throw await errorFromResponse(response)

	const parsed: ParsedCompleteMessage = await response.json()

	return JSON.stringify(parsed, null, 2)
}

export default createChatCompletion
