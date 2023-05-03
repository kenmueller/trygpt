'use client'

import Image from 'next/image'
import cx from 'classnames'

import ChatMessage from '@/lib/chat/message'
import Markdown from '@/components/Markdown'
import CopyButton from './MessageCopyButton'
import ThreeDotsLoader from '@/components/ThreeDotsLoader'
import defaultUserImage from '@/assets/user.png'
import assistantImage from '@/assets/chatgpt.jpg'
import SoundButton from './MessageSoundButton'
import { ChatWithUserData } from '@/lib/chat'

const ChatMessage = ({
	chat,
	message
}: {
	chat: ChatWithUserData
	message: ChatMessage
}) => (
	<article
		className={cx(
			'message flex gap-2 w-700:gap-4 relative pl-2 py-4 w-700:pl-4 pr-[calc(0.5rem+40px+0.5rem)] w-700:pr-[calc(1rem+40px+1rem)]',
			message.role === 'assistant' && 'bg-white bg-opacity-10',
			message.error && 'bg-red-500 bg-opacity-100'
		)}
	>
		<Image
			className="image shrink-0 rounded-lg w-700:rounded-2xl w-6 h-6 w-700:w-12 w-700:h-12"
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
		<Markdown className="content grow-[1] min-h-[75px]" text={message.text} />
		<div className="options absolute right-2 w-700:right-4 top-4 flex flex-col items-center gap-2">
			<CopyButton message={message} />
			<SoundButton message={message} />
		</div>
		{message.loading && (
			<ThreeDotsLoader className="loader absolute right-2 w-700:right-4 bottom-4" />
		)}
	</article>
)

export default ChatMessage
