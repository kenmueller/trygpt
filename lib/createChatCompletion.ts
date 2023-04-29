import 'server-only'

if (!process.env.OPENAI_API_KEY) throw new Error('Missing OPENAI_API_KEY')
if (!process.env.NEXT_PUBLIC_OPENAI_MODEL)
	throw new Error('Missing NEXT_PUBLIC_OPENAI_MODEL')

import ChatMessage from '@/lib/chat/message'
import responseToGenerator from './responseToGenerator'

export type ChatCompletionMessage = Pick<ChatMessage, 'role' | 'text'>

interface ParsedMessage {
	choices: [{ delta: { content?: string } }]
}

const createChatCompletion = async function* (
	messages: ChatCompletionMessage[]
) {
	const response = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			authorization: `Bearer ${process.env.OPENAI_API_KEY!}`
		},
		body: JSON.stringify({
			model: process.env.NEXT_PUBLIC_OPENAI_MODEL!,
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
				const parsed: ParsedMessage = JSON.parse(message)

				const chunk = parsed.choices[0].delta.content
				if (!chunk) continue

				yield chunk
			} catch (unknownError) {
				console.error(unknownError)
			}
		}
	}
}

export default createChatCompletion
