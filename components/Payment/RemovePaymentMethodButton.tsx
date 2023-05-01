'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'

import alertError from '@/lib/error/alert'
import errorFromResponse from '@/lib/error/fromResponse'
import errorFromUnknown from '@/lib/error/fromUnknown'
import ThreeDotsLoader from '@/components/ThreeDotsLoader'
import { logEvent } from '@/lib/analytics/lazy'
import formatCents from '@/lib/cents/format'

const RemovePaymentMethodButton = ({
	className,
	remainingCost
}: {
	className?: string
	remainingCost: number
}) => {
	const router = useRouter()

	const [isLoading, setIsLoading] = useState(false)

	const onClick = useCallback(async () => {
		try {
			setIsLoading(true)

			logEvent('click_remove_payment_method_button')

			if (
				!confirm(
					`Are you sure you want to remove your payment method?${
						remainingCost > 0
							? ` You will immediately be charged ${formatCents(
									remainingCost
							  )} for your remaining usage this period.`
							: ''
					}`
				)
			)
				return

			logEvent('click_remove_payment_method_button_confirmed')

			const response = await fetch('/api/stripe/payment-methods', {
				method: 'DELETE'
			})

			if (!response.ok) throw await errorFromResponse(response)

			router.refresh()
		} catch (unknownError) {
			alertError(errorFromUnknown(unknownError))
		} finally {
			setIsLoading(false)
		}
	}, [remainingCost, router, setIsLoading])

	return (
		<button className={className} disabled={isLoading} onClick={onClick}>
			{isLoading ? <ThreeDotsLoader /> : 'Remove payment method'}
		</button>
	)
}

export default RemovePaymentMethodButton
