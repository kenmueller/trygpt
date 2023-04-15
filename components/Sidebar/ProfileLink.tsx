'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

import User from '@/lib/user'
import defaultUserImage from '@/assets/user.png'

import styles from './ProfileLink.module.scss'

const SidebarProfileLink = ({ user }: { user: User }) => {
	const pathname = usePathname()

	return (
		<Link
			className={styles.root}
			aria-current={pathname === '/profile' ? 'page' : undefined}
			href="/profile"
		>
			<Image
				className={styles.image}
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
