'use client'

import { useCallback, useState } from 'react'

import alertError from '@/lib/error/alert'
import errorFromResponse from '@/lib/error/fromResponse'
import errorFromUnknown from '@/lib/error/fromUnknown'
import ThreeDotsLoader from '@/components/ThreeDotsLoader'
import { logEvent } from '@/lib/analytics/lazy'

const UpdatePaymentMethodButton = ({ className }: { className?: string }) => {
	const [isLoading, setIsLoading] = useState(false)

	const onClick = useCallback(async () => {
		try {
			setIsLoading(true)

			logEvent('click_update_payment_method_button')

			const response = await fetch('/api/stripe/checkout-sessions', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ mode: 'setup' })
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
			{isLoading ? <ThreeDotsLoader /> : 'Update payment method'}
		</button>
	)
}

export default UpdatePaymentMethodButton
