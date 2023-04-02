import Image from 'next/image'
import Link from 'next/link'

import User from '@/lib/user'
import defaultUser from '@/assets/user.png'

import styles from './Nav.module.scss'

const Nav = ({ user }: { user: User }) => (
	<nav className={styles.root}>
		<Link className={styles.user} href="/profile">
			<Image
				className={styles.userImage}
				src={user.photo ?? defaultUser}
				alt={user.name}
				referrerPolicy={user.photo ? 'no-referrer' : undefined}
				width={50}
				height={50}
			/>
		</Link>
	</nav>
)

export default Nav
