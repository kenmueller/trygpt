'use client'

import { useCallback, useState } from 'react'

import alertError from '@/lib/error/alert'
import errorFromResponse from '@/lib/error/fromResponse'
import errorFromUnknown from '@/lib/error/fromUnknown'
import ThreeDotsLoader from '@/components/ThreeDotsLoader'

const BuyLink = ({ className }: { className?: string }) => {
	const [isLoading, setIsLoading] = useState(false)

	const onClick = useCallback(async () => {
		try {
			setIsLoading(true)

			const response = await fetch('/api/stripe/checkout-sessions', {
				method: 'POST'
			})
			if (!response.ok) throw await errorFromResponse(response)

			window.location.href = await response.text()
		} catch (unknownError) {
			setIsLoading(false)
			alertError(errorFromUnknown(unknownError))
		}
	}, [setIsLoading])

	return (
		<button className={className} disabled={isLoading} onClick={onClick}>
			{isLoading ? <ThreeDotsLoader /> : 'Purchase tokens for $1'}
		</button>
	)
}

export default BuyLink
