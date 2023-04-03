type ChatMessageRole = 'system' | 'user' | 'assistant'

export default interface ChatMessage {
	chatId: string
	id: string
	role: ChatMessageRole
	text: string

	/** Milliseconds since epoch. */
	created: number

	/** If this message is loading. Only for assistant responses. */
	loading?: true

	/** If this message generated an error. */
	error?: true
}
