export default interface Chat {
	userId: string

	id: string
	name: string | null

	/** Milliseconds since epoch. */
	created: number

	/** Milliseconds since epoch. */
	updated: number
}

export interface ChatWithUserData extends Chat {
	userPhoto: string | null
	userName: string
	userPoints: number
}
