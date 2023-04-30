'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'
import { useCallback } from 'react'
import { useSetRecoilState } from 'recoil'
import { logEvent } from 'firebase/analytics'

import isSidebarShowingState from '@/lib/atoms/isSidebarShowing'
import analytics from '@/lib/analytics'

const SidebarNewChatLink = () => {
	const setIsSidebarShowing = useSetRecoilState(isSidebarShowingState)

	const pathname = usePathname()
	const active = pathname === '/chats/new'

	const onClick = useCallback(() => {
		logEvent(analytics, 'click_sidebar_new_chat')
		setIsSidebarShowing(false)
	}, [setIsSidebarShowing])

	return (
		<Link
			className={cx(
				'flex items-center gap-4 px-4 py-2 font-bold transition-colors ease-linear hover:bg-white hover:bg-opacity-10',
				active && 'pointer-events-none bg-white bg-opacity-10'
			)}
			aria-current={active ? 'page' : undefined}
			href="/chats/new"
			onClick={onClick}
		>
			<FontAwesomeIcon className="shrink-0 w-[30px] text-xl" icon={faPlus} />
			New Chat
		</Link>
	)
}

export default SidebarNewChatLink
