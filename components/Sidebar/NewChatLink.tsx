'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import styles from './NewChatLink.module.scss'

const SidebarNewChatLink = () => {
	const pathname = usePathname()

	return (
		<Link
			className={styles.root}
			aria-current={pathname === '/chats/new' ? 'page' : undefined}
			href="/chats/new"
		>
			<FontAwesomeIcon className={styles.icon} icon={faPlus} />
			New Chat
		</Link>
	)
}

export default SidebarNewChatLink
