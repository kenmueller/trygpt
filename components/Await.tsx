import { ReactNode } from 'react'

// @ts-expect-error
const Await = async ({
	promise,
	children
}: {
	promise: Promise<unknown>
	children?: ReactNode
}) => {
	await promise
	return children
}

export default Await
