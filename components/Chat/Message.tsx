'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { useRecoilValue } from 'recoil'
import cx from 'classnames'

import ChatMessage from '@/lib/chat/message'
import Markdown from '@/components/Markdown'
import SoundButton from './MessageSoundButton'
import CopyButton from './MessageCopyButton'
import ThreeDotsLoader from '@/components/ThreeDotsLoader'
import defaultUserImage from '@/assets/user.png'
import assistantImage from '@/assets/chatgpt.jpg'
import chatState from '@/lib/atoms/chat'

const ChatMessage = ({ message }: { message: ChatMessage }) => {
	const chat = useRecoilValue(chatState)
	if (!chat) throw new Error('Chat not found')

	const content = useRef<HTMLDivElement | null>(null)

	return (
		<article
			className={cx(
				'flex gap-2 w-700:gap-4 relative pl-2 py-4 w-700:pl-4 pr-[calc(0.5rem+40px+0.5rem)] w-700:pr-[calc(1rem+40px+1rem)]',
				message.role === 'assistant' && 'bg-white bg-opacity-10',
				message.error && 'bg-red-500 bg-opacity-100'
			)}
		>
			<Image
				className="shrink-0 rounded-lg w-700:rounded-2xl w-6 h-6 w-700:w-12 w-700:h-12"
				src={
					message.role === 'user'
						? chat.userPhoto ?? defaultUserImage
						: assistantImage
				}
				alt={message.role === 'user' ? chat.userName : 'ChatGPT'}
				referrerPolicy={
					message.role === 'user' && chat.userPhoto ? 'no-referrer' : undefined
				}
				width={50}
				height={50}
			/>
			<Markdown ref={content} className="min-h-[40px]" text={message.text} />
			{/* {message.role === 'assistant' && (
				<SoundButton message={message} />
			)} */}
			<CopyButton
				className="absolute right-2 w-700:right-4 top-4"
				content={content}
			/>
			{message.loading && (
				<ThreeDotsLoader className="absolute right-2 w-700:right-4 bottom-4" />
			)}
		</article>
	)
}

export default ChatMessage
