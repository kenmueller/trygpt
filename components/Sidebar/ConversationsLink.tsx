'use client'

import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/free-solid-svg-icons'

import { logEvent } from '@/lib/analytics/lazy'

const onClick = () => {
	logEvent('click_sidebar_conversations')
}

const SidebarConversationsLink = () => (
	<Link
		className="flex items-center gap-4 h-10 px-4 font-bold transition-colors ease-linear hover:bg-white hover:bg-opacity-10"
		href="/conversations"
		onClick={onClick}
	>
		<FontAwesomeIcon className="shrink-0 w-[30px] text-xl" icon={faComment} />
		Conversations
	</Link>
)

export default SidebarConversationsLink
