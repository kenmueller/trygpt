'use client'

import { useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShareSquare } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import copy from 'copy-to-clipboard'

import Chat from '@/lib/chat'
import { logEvent } from '@/lib/analytics/lazy'
import ORIGIN from '@/lib/origin'

const ChatInputShareButton = ({ chat }: { chat: Chat }) => {
	const onClick = useCallback(() => {
		logEvent('click_share_chat')

		copy(new URL(`/chats/${encodeURIComponent(chat.id)}`, ORIGIN).href)
		toast.success('Copied chat link to clipboard')
	}, [chat.id])

	return (
		<button
			className="pl-1 text-xl w-450:text-2xl text-sky-500 transition-colors ease-linear hover:text-opacity-70"
			aria-label="Copy chat link to clipboard"
			data-balloon-pos="up-left"
			onClick={onClick}
		>
			<FontAwesomeIcon icon={faShareSquare} />
		</button>
	)
}

export default ChatInputShareButton
