'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

const SidebarNewChatLink = () => {
	const pathname = usePathname()

	return (
		<Link
			aria-current={pathname === '/chats/new' ? 'page' : undefined}
			href="/chats/new"
		>
			<FontAwesomeIcon icon={faPlus} />
			New Chat
		</Link>
	)
}

export default SidebarNewChatLink
