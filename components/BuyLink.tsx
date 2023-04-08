'use client'

import { useCallback, useState } from 'react'

import alertError from '@/lib/error/alert'
import errorFromResponse from '@/lib/error/fromResponse'

const BuyLink = ({ className }: { className?: string }) => {
	const [isLoading, setIsLoading] = useState(false)

	const onClick = useCallback(async () => {
		try {
			setIsLoading(true)

			const response = await fetch('/api/stripe/checkout/sessions', {
				method: 'POST'
			})
			if (!response.ok) throw await errorFromResponse(response)

			window.location.href = await response.text()
		} catch (unknownError) {
			setIsLoading(false)
			alertError(unknownError)
		}
	}, [setIsLoading])

	return (
		<button className={className} disabled={isLoading} onClick={onClick}>
			{isLoading ? 'Loading...' : 'Purchase tokens for $1'}
		</button>
	)
}

export default BuyLink
