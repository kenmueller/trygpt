import { ReactNode } from 'react'

const Await = async <Value,>({
	promise,
	children
}: {
	promise: Promise<Value>
	children?: ReactNode
}) => {
	await promise
	return children
}

export default Await
