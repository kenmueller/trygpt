'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const Refresh = () => {
	const router = useRouter()

	useEffect(() => {
		router.refresh()
	}, [router])

	return null
}

export default Refresh
