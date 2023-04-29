'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'

const PurchasedAlert = () => {
	const searchParams = useSearchParams()
	const purchased = searchParams.get('purchased')

	useEffect(() => {
		switch (purchased) {
			case 'true':
				toast.success('Thank you for purchasing GPT 4!')
				break
			case 'false':
				toast.info("That's okay, you can always buy GPT 4 later.")
				break
		}

		if (purchased) {
			const newUrl = new URL(window.location.href)
			newUrl.searchParams.delete('purchased')

			window.history.replaceState({ path: newUrl.href }, '', newUrl.href)
		}
	}, [purchased])

	return null
}

export default PurchasedAlert
