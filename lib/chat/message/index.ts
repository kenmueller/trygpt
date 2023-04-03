type ChatMessageRole = 'system' | 'user' | 'assistant'

export default interface ChatMessage {
	chatId: string
	id: string
	role: ChatMessageRole
	text: string

	/** Milliseconds since epoch. */
	created: number
}
