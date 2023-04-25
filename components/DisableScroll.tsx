'use client'

import { useLayoutEffect } from 'react'

const DisableScroll = () => {
	useLayoutEffect(() => {
		document.body.classList.add('overflow-hidden')

		return () => {
			document.body.classList.remove('overflow-hidden')
		}
	}, [])

	return null
}

export default DisableScroll
