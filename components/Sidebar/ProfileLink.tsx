'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useRecoilValue } from 'recoil'

import userState from '@/lib/atoms/user'
import defaultUserImage from '@/assets/user.png'

const SidebarProfileLink = () => {
	const user = useRecoilValue(userState)
	const pathname = usePathname()

	if (!user) throw new Error('User is not signed in')

	return (
		<Link
			aria-current={pathname === '/profile' ? 'page' : undefined}
			href="/profile"
		>
			<Image
				src={user.photo ?? defaultUserImage}
				alt={user.name}
				referrerPolicy={user.photo ? 'no-referrer' : undefined}
				width={50}
				height={50}
				priority
			/>
			Profile
		</Link>
	)
}

export default SidebarProfileLink
