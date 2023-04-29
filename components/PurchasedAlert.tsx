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
	}, [purchased])

	return null
}

export default PurchasedAlert
