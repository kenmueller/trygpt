export default interface User {
	id: string

	/** Stripe customer ID. */
	customerId: string

	/** Photo URL. */
	photo: string | null

	name: string
	email: string

	/** Milliseconds since epoch. */
	lastBilled: number | null

	requestTokens: number
	responseTokens: number

	/** In cents. */
	purchasedAmount: number

	/** Milliseconds since epoch. */
	created: number

	/** Milliseconds since epoch. */
	updated: number
}
