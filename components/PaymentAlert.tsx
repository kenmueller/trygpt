'use client'

import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useRecoilValue } from 'recoil'

import { logEvent } from '@/lib/analytics/lazy'
import userState from '@/lib/atoms/user'

const PurchasedAlert = () => {
	const user = useRecoilValue(userState)
	const userId = user?.id ?? null

	useEffect(() => {
		const name = 'purchased-gpt-4'

		const searchParams = new URLSearchParams(window.location.search)
		const purchased = searchParams.get(name)

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

		if (purchased) {
			const newUrl = new URL(window.location.href)
			newUrl.searchParams.delete(name)

			window.history.replaceState({ path: newUrl.href }, '', newUrl.href)
		}
	}, [userId])

	useEffect(() => {
		const name = 'updated-payment-method'

		const searchParams = new URLSearchParams(window.location.search)
		const updated = searchParams.get(name)

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

		if (updated) {
			const newUrl = new URL(window.location.href)
			newUrl.searchParams.delete(name)

			window.history.replaceState({ path: newUrl.href }, '', newUrl.href)
		}
	}, [userId])

	return null
}

export default PurchasedAlert
