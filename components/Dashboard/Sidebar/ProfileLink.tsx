'use client'

import { useCallback } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import cx from 'classnames'

import userState from '@/lib/atoms/user'
import defaultUserImage from '@/assets/user.png'
import isSidebarShowingState from '@/lib/atoms/isSidebarShowing'
import { logEvent } from '@/lib/analytics/lazy'

const SidebarProfileLink = () => {
	const user = useRecoilValue(userState)
	const setIsSidebarShowing = useSetRecoilState(isSidebarShowingState)

	const pathname = usePathname()

	if (!user) throw new Error('User is not signed in')

	const active = pathname === '/profile'

	const onClick = useCallback(() => {
		logEvent('click_sidebar_profile')
		setIsSidebarShowing(false)
	}, [setIsSidebarShowing])

	return (
		<Link
			className={cx(
				'flex items-center gap-4 px-4 py-2 font-bold transition-colors ease-linear hover:bg-white hover:bg-opacity-10',
				active && 'pointer-events-none bg-white bg-opacity-10'
			)}
			aria-current={active ? 'page' : undefined}
			href="/profile"
			onClick={onClick}
		>
			<Image
				className="rounded-lg"
				src={user.photo ?? defaultUserImage}
				alt={user.name}
				referrerPolicy={user.photo ? 'no-referrer' : undefined}
				width={30}
				height={30}
				priority
			/>
			Profile
		</Link>
	)
}

export default SidebarProfileLink
