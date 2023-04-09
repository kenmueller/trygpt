import ErrorCode from '@/lib/error/code'
import HttpError from '@/lib/error/http'

const responseToGenerator = async function* ({ body }: Response) {
	if (!body) throw new HttpError(ErrorCode.Internal, 'No body')

	const reader = body.getReader()
	const decoder = new TextDecoder()

	while (true) {
		const { done, value } = await reader.read()
		if (done) break

		yield decoder.decode(value, { stream: true })
	}

	reader.releaseLock()
}

export default responseToGenerator
