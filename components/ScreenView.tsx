'use client'

import { usePathname, useParams } from 'next/navigation'
import { useEffect } from 'react'

import { setScreen } from '@/lib/analytics/lazy'

const SCREENS = [
	{ match: '/', name: 'Landing', className: 'LandingPage' },
	{ match: '/chats/new', name: 'NewChat', className: 'NewChatPage' },
	{ match: /^\/chats\/.+$/, name: 'Chat', className: 'ChatPage' },
	{ match: '/profile', name: 'Profile', className: 'ProfilePage' }
]

const ScreenView = () => {
	const pathname = usePathname()
	const params = useParams()

	useEffect(() => {
		const screen = SCREENS.find(({ match }) =>
			typeof match === 'string' ? match === pathname : match.test(pathname)
		)

		setScreen(
			screen?.name ?? 'NotFound',
			screen?.className ?? 'NotFoundPage',
			params
		)
	}, [pathname, params])

	return null
}

export default ScreenView
