'use client'

import Link from 'next/link'
import { useRecoilValue } from 'recoil'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMessage } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import Chat from '@/lib/chat'
import chatState from '@/lib/atoms/chat'

const SidebarChatLink = ({ chat }: { chat: Chat }) => {
	const currentChat = useRecoilValue(chatState)
	const active = chat.id === currentChat?.id

	return (
		<Link
			className={cx(
				'flex items-center gap-4 px-4 py-2 transition-colors ease-linear hover:bg-white hover:bg-opacity-10',
				active && 'bg-white bg-opacity-10'
			)}
			aria-current={active ? 'page' : undefined}
			href={`/chats/${encodeURIComponent(chat.id)}`}
		>
			<FontAwesomeIcon className="w-[30px] text-xl" icon={faMessage} />
			{chat.name ?? 'Untitled'}
		</Link>
	)
}

export default SidebarChatLink
