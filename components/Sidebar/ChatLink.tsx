'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMessage } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import Chat from '@/lib/chat'

const PATHNAME_MATCH = /^\/chats\/(.+)$/

const SidebarChatLink = ({ chat }: { chat: Chat }) => {
	const pathname = usePathname()
	const currentChatId = pathname.match(PATHNAME_MATCH)?.[1] ?? null

	const active = chat.id === currentChatId

	return (
		<Link
			className={cx(
				'flex items-center gap-4 px-4 py-2 transition-colors ease-linear hover:bg-white hover:bg-opacity-10',
				active && 'bg-white bg-opacity-10'
			)}
			aria-current={active ? 'page' : undefined}
			href={`/chats/${encodeURIComponent(chat.id)}`}
		>
			<FontAwesomeIcon className="shrink-0 w-[30px] text-xl" icon={faMessage} />
			{chat.name ?? 'Untitled'}
		</Link>
	)
}

export default SidebarChatLink
