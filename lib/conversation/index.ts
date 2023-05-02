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
