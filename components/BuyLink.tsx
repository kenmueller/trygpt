'use client'

import { useCallback, useState } from 'react'
import { logEvent } from 'firebase/analytics'

import alertError from '@/lib/error/alert'
import errorFromResponse from '@/lib/error/fromResponse'
import errorFromUnknown from '@/lib/error/fromUnknown'
import ThreeDotsLoader from '@/components/ThreeDotsLoader'
import formatCents from '@/lib/cents/format'
import analytics from '@/lib/analytics'

const BuyLink = ({ className }: { className?: string }) => {
	const [isLoading, setIsLoading] = useState(false)

	const onClick = useCallback(async () => {
		try {
			setIsLoading(true)

			logEvent(analytics, 'click_buy_link')

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
			{isLoading ? (
				<ThreeDotsLoader />
			) : (
				`Purchase GPT 4 for ${formatCents(100)}`
			)}
		</button>
	)
}

export default BuyLink
