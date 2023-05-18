export default interface ImageCompletion {
	userId: string
	id: string

	prompt: string

	created: number
	updated: number

	expanded?: true
	loading?: true
	error?: true
}
