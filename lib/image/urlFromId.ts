if (!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)
	throw new Error('Missing NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET')

const imageCompletionUrlFromId = (id: string) =>
	`https://firebasestorage.googleapis.com/v0/b/${process.env
		.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!}/o/${encodeURIComponent(
		`image-completions/${encodeURIComponent(id)}`
	)}?alt=media`

export default imageCompletionUrlFromId
