export default interface Conversation {
	userId: string
	chatId: string
	id: string
	slug: string
	title: string
	text: string
	upvotes: number
	downvotes: number
	points: number
	views: number
	comments: number
	created: number
	updated: number
}

export interface ConversationWithUserData extends Conversation {
	userPhoto: string | null
	userName: string
	userPoints: number
}

export interface ConversationWithChatData extends Conversation {
	chatName: string
}

export type ConversationWithUserAndChatData = ConversationWithUserData &
	ConversationWithChatData
