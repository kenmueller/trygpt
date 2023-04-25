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
				'flex gap-4 relative p-4 pr-[calc(1rem+40px+1rem)]',
				message.role === 'assistant' && 'bg-white bg-opacity-10',
				message.error && 'bg-red-500 bg-opacity-100'
			)}
		>
			<Image
				className="shrink-0 rounded-2xl w-[50px] h-[50px]"
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
			<Markdown ref={content} text={message.text} />
			{/* {message.role === 'assistant' && (
				<SoundButton message={message} />
			)} */}
			<CopyButton className="absolute right-8 top-4" content={content} />
			{message.loading && (
				<ThreeDotsLoader className="absolute right-8 bottom-4" />
			)}
		</article>
	)
}

export default ChatMessage
