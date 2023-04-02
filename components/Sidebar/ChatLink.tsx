'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

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
			{chat.name ?? 'Untitled'}
		</Link>
	)
}

export default SidebarChatLink
