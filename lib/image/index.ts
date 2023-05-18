export default interface ImageCompletion {
	userId: string
	id: string

	prompt: string

	created: number
	updated: number

	loading?: true
	error?: true
}
