'use client'

import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShareSquare } from '@fortawesome/free-solid-svg-icons'
import { useCallback } from 'react'
import { useRecoilValue } from 'recoil'

import Chat from '@/lib/chat'
import { logEvent } from '@/lib/analytics/lazy'
import userState from '@/lib/atoms/user'

const ChatInputShareButton = ({ chat }: { chat: Chat }) => {
	const router = useRouter()
	const user = useRecoilValue(userState)

	const isOwner = user && user.id === chat.userId

	const conversationPath =
		chat.conversationId && chat.conversationSlug
			? `/conversations/${encodeURIComponent(
					chat.conversationId
			  )}/${encodeURIComponent(chat.conversationSlug)}`
			: null

	const share = useCallback(() => {
		logEvent('click_post_chat')

		router.push(
			conversationPath ??
				`/conversations/new?chat=${encodeURIComponent(chat.id)}`
		)
	}, [router, conversationPath, chat.id])

	return (
		<button
			className="pl-1 text-xl w-450:text-2xl text-sky-500 transition-colors ease-linear hover:text-opacity-70 disabled:text-opacity-50"
			aria-label={
				conversationPath ? 'View conversation' : 'Post chat as a conversation'
			}
			data-balloon-pos="up-left"
			disabled={!(isOwner || conversationPath)}
			onClick={share}
		>
			<FontAwesomeIcon icon={faShareSquare} />
		</button>
	)
}

export default ChatInputShareButton
