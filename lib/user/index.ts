export default interface User {
	id: string

	/** Stripe customer ID. */
	customerId: string

	/** Stripe customer payment method ID. */
	paymentMethod: string | null

	/** Photo URL. */
	photo: string | null

	name: string
	email: string

	/** Milliseconds since epoch. */
	lastCharged: number | null

	requestTokens: number
	responseTokens: number

	/** In cents. */
	purchasedAmount: number

	/** Milliseconds since epoch. */
	created: number

	/** Milliseconds since epoch. */
	updated: number
}
