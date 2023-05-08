'use client'

import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/free-solid-svg-icons'
import { useRecoilValue } from 'recoil'
import cx from 'classnames'

import Chat from '@/lib/chat'
import { logEvent } from '@/lib/analytics/lazy'
import userState from '@/lib/atoms/user'

const onClick = () => {
	logEvent('click_post_chat')
}

const ChatInputConversationButton = ({ chat }: { chat: Chat }) => {
	const user = useRecoilValue(userState)

	const conversationPath =
		chat.conversationId && chat.conversationSlug
			? `/conversations/${encodeURIComponent(
					chat.conversationId
			  )}/${encodeURIComponent(chat.conversationSlug)}`
			: null

	const path =
		conversationPath ?? `/conversations/new?chat=${encodeURIComponent(chat.id)}`

	const isOwner = user?.id === chat.userId
	const disabled = !(isOwner || conversationPath)

	return (
		<Link
			className={cx(
				'pl-1 text-xl w-450:text-2xl text-sky-500 transition-colors ease-linear hover:text-opacity-70',
				disabled && 'pointer-events-none text-opacity-50'
			)}
			aria-label={
				conversationPath ? 'View conversation' : 'Post chat as a conversation'
			}
			data-balloon-pos="up-left"
			aria-disabled={disabled || undefined}
			href={disabled ? '#' : path}
			onClick={onClick}
		>
			<FontAwesomeIcon icon={faComment} />
		</Link>
	)
}

export default ChatInputConversationButton
