import 'server-only'

if (!process.env.OPENAI_API_KEY) throw new Error('Missing OPENAI_API_KEY')

import errorFromResponse from '@/lib/error/fromResponse'

interface ParsedCompleteMessage {
	data: [{ url: string }]
}

const createImageCompletion = async (prompt: string) => {
	const response = await fetch('https://api.openai.com/v1/images/generations', {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			authorization: `Bearer ${process.env.OPENAI_API_KEY!}`
		},
		body: JSON.stringify({
			prompt,
			n: 1,
			size: '1024x1024'
		})
	})

	if (!response.ok) throw await errorFromResponse(response)

	const parsed: ParsedCompleteMessage = await response.json()

	const image = parsed.data[0] as
		| ParsedCompleteMessage['data'][number]
		| undefined

	if (!image) throw new Error('No image returned')

	return image.url
}

export default createImageCompletion
