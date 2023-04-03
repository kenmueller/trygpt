import ErrorCode from '@/lib/error/code'
import HttpError from '@/lib/error/http'

const streamResponse = async (
	body: ReadableStream<Uint8Array>,
	onChunk: (chunk: string) => void
) => {
	if (!body) throw new HttpError(ErrorCode.Internal, 'No body')

	const reader = body.getReader()
	let data = ''

	while (true) {
		const { done, value } = await reader.read()
		if (done) break

		const chunk = value.toString()

		onChunk(chunk)
		data += chunk
	}

	reader.releaseLock()

	return data
}

export default streamResponse
