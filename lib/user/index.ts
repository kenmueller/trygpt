export default interface User {
	id: string

	/** Stripe customer ID. */
	customerId: string | null

	/** Stripe customer payment method ID. */
	paymentMethod: string | null

	/** Photo URL. */
	photo: string | null

	name: string
	email: string

	points: number

	/** Milliseconds since epoch. */
	lastCharged: number | null

	promptTokens: number
	completionTokens: number

	images: number

	/** In cents. */
	purchasedAmount: number

	previewMessages: number
	previewImages: number

	admin: boolean

	/** Milliseconds since epoch. */
	created: number

	/** Milliseconds since epoch. */
	updated: number
}

export type PublicUser = Pick<
	User,
	'id' | 'photo' | 'name' | 'points' | 'admin' | 'created' | 'updated'
>
