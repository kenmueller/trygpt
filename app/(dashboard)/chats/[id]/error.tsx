'use client'

import { useEffect } from 'react'

import styles from './error.module.scss'

const ErrorBoundary = ({
	error,
	reset
}: {
	error: Error
	reset: () => void
}) => {
	const notFound = error.message === 'NEXT_NOT_FOUND'

	useEffect(() => {
		console.error(error)
	}, [error])

	return (
		<main className={styles.root}>
			<h1>{notFound ? 'Chat not found' : 'An error occurred'}</h1>
			{!notFound && (
				<>
					<p className={styles.message}>{error.message}</p>
					<button className={styles.reset} onClick={reset}>
						Try again
					</button>
				</>
			)}
		</main>
	)
}

export default ErrorBoundary
