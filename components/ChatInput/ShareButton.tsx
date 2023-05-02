'use client'

if (!process.env.NEXT_PUBLIC_HOST) throw new Error('Missing NEXT_PUBLIC_HOST')

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShareSquare } from '@fortawesome/free-solid-svg-icons'
import copy from 'copy-to-clipboard'
import { toast } from 'react-toastify'
import { useCallback } from 'react'

import Chat from '@/lib/chat'
import { logEvent } from '@/lib/analytics/lazy'
import DEV from '@/lib/dev'

const ChatInputShareButton = ({ chat }: { chat: Chat }) => {
	const share = useCallback(() => {
		logEvent('share_chat')

		const url = `${DEV ? 'http' : 'https'}://${process.env
			.NEXT_PUBLIC_HOST!}/chats/${encodeURIComponent(chat.id)}`

		copy(url)

		toast.success('Chat link copied to clipboard')
	}, [chat.id])

	return (
		<button
			className="pl-1 text-xl w-450:text-2xl text-sky-500 transition-colors ease-linear hover:text-opacity-70 disabled:text-opacity-50"
			aria-label="Copy chat link to clipboard"
			data-balloon-pos="up-left"
			onClick={share}
		>
			<FontAwesomeIcon icon={faShareSquare} />
		</button>
	)
}

export default ChatInputShareButton
