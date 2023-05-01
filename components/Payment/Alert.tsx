'use client'

import { useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'
import { useRecoilValue } from 'recoil'

import { logEvent } from '@/lib/analytics/lazy'
import userState from '@/lib/atoms/user'

const PURCHASED_NAME = 'purchased-gpt-4'
const UPDATED_NAME = 'updated-payment-method'

const PurchasedAlert = () => {
	const router = useRouter()

	const pathname = usePathname()
	const searchParams = useSearchParams()

	const user = useRecoilValue(userState)
	const userId = user?.id ?? null

	useEffect(() => {
		const purchased = searchParams.get(PURCHASED_NAME)
		const updated = searchParams.get(UPDATED_NAME)

		switch (purchased) {
			case 'true':
				logEvent('purchase_success', { userId })
				toast.success('Thank you for purchasing GPT 4!')
				break
			case 'false':
				logEvent('purchase_cancel', { userId })
				toast.info("That's okay, you can always buy GPT 4 later.")
				break
		}

		switch (updated) {
			case 'true':
				logEvent('update_payment_method_success', { userId })
				toast.success('Successfully updated your payment method!')
				break
			case 'false':
				logEvent('update_payment_method_cancel', { userId })
				toast.info('Your payment method remains unchanged.')
				break
		}

		const newSearchParams = new URLSearchParams(searchParams.toString())

		if (purchased) newSearchParams.delete(PURCHASED_NAME)
		if (updated) newSearchParams.delete(UPDATED_NAME)

		if (purchased || updated) {
			const newSearch = newSearchParams.toString()
			router.replace(`${pathname}${newSearch && `?${newSearch}`}`)
		}
	}, [router, pathname, searchParams, userId])

	return null
}

export default PurchasedAlert
