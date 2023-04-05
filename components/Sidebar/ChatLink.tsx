'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMessage } from '@fortawesome/free-solid-svg-icons'

import Chat from '@/lib/chat'

import styles from './ChatLink.module.scss'

const PATHNAME_MATCH = /^\/chats\/(.+)$/

const SidebarChatLink = ({ chat }: { chat: Chat }) => {
	const pathname = usePathname()
	const currentChatId = pathname.match(PATHNAME_MATCH)?.[1] ?? null

	return (
		<Link
			className={styles.root}
			aria-current={chat.id === currentChatId ? 'page' : undefined}
			href={`/chats/${encodeURIComponent(chat.id)}`}
		>
			<FontAwesomeIcon className={styles.icon} icon={faMessage} />
			{chat.name ?? 'Untitled'}
		</Link>
	)
}

export default SidebarChatLink
