export default interface User {
	id: string

	/** Photo URL. */
	photo: string | null

	name: string
	email: string

	/** Milliseconds since epoch. */
	billingStartTime: number | null

	totalTokens: number
	purchasedTokens: number

	/** Milliseconds since epoch. */
	created: number

	/** Milliseconds since epoch. */
	updated: number
}
