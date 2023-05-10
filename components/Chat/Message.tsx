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
import User from '@/lib/user'

const ChatMessage = ({
	user,
	message
}: {
	user: Pick<User, 'photo' | 'name'>
	message: ChatMessage
}) => (
	<article
		className={cx(
			'message flex gap-2 min-[700px]:gap-4 relative pl-2 py-4 min-[700px]:pl-4 pr-[calc(0.5rem+40px+0.5rem)] min-[700px]:pr-[calc(1rem+40px+1rem)]',
			message.role === 'assistant' && 'bg-white bg-opacity-10',
			message.error && 'bg-red-500 bg-opacity-100'
		)}
	>
		<Image
			className="image shrink-0 rounded-lg min-[700px]:rounded-2xl w-6 h-6 min-[700px]:w-12 min-[700px]:h-12"
			src={
				message.role === 'user'
					? user.photo ?? defaultUserImage
					: assistantImage
			}
			alt={message.role === 'user' ? user.name : 'ChatGPT'}
			referrerPolicy={
				message.role === 'user' && user.photo ? 'no-referrer' : undefined
			}
			width={50}
			height={50}
		/>
		<Markdown className="content grow-[1] min-h-[75px]" text={message.text} />
		<div className="options absolute right-2 min-[700px]:right-4 top-4 flex flex-col items-center gap-2">
			<CopyButton message={message} />
			<SoundButton message={message} />
		</div>
		{message.loading && (
			<ThreeDotsLoader className="loader absolute right-2 min-[700px]:right-4 bottom-4" />
		)}
	</article>
)

export default ChatMessage
