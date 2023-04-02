export default interface User {
	id: string

	/** Photo URL. */
	photo: string | null

	name: string
	email: string

	/** Milliseconds since epoch. */
	created: number
}
