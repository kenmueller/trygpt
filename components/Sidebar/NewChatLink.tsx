'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

const SidebarNewChatLink = () => {
	const pathname = usePathname()
	const active = pathname === '/chats/new'

	return (
		<Link
			className={cx(
				'flex items-center gap-4 px-4 py-2 font-bold transition-colors ease-linear hover:bg-white hover:bg-opacity-10',
				active && 'pointer-events-none bg-white bg-opacity-10'
			)}
			aria-current={active ? 'page' : undefined}
			href="/chats/new"
		>
			<FontAwesomeIcon className="shrink-0 w-[30px] text-xl" icon={faPlus} />
			New Chat
		</Link>
	)
}

export default SidebarNewChatLink
