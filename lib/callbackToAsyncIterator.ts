export type AsyncIteratorCallbackSuccessData<Value> =
	| { value: Value; done: false }
	| { value: undefined; done: true }

export type AsyncIteratorCallbackFailureData = { error: unknown }

export type AsyncIteratorCallbackData<Value> =
	| AsyncIteratorCallbackSuccessData<Value>
	| AsyncIteratorCallbackFailureData

const callbackToAsyncIterator =
	<Args extends unknown[], Value>(
		fn: (
			...args: [...Args, (data: AsyncIteratorCallbackData<Value>) => void]
		) => void | Promise<void>
	) =>
	async (...args: Args) => {
		const values: Promise<AsyncIteratorCallbackSuccessData<Value>>[] = []

		let resolve: (data: AsyncIteratorCallbackSuccessData<Value>) => void
		let reject: (error: unknown) => void

		const nextPromise = () =>
			new Promise<AsyncIteratorCallbackSuccessData<Value>>(
				(_resolve, _reject) => {
					resolve = _resolve
					reject = _reject
				}
			)

		values.push(nextPromise())

		await fn(...args, (data: AsyncIteratorCallbackData<Value>) => {
			'error' in data ? reject(data.error) : resolve(data)
			values.push(nextPromise())
		})

		const iterator = async function* () {
			for await (const { value, done } of values) {
				if (done) break
				yield value
			}
		}

		return iterator()
	}

export default callbackToAsyncIterator
