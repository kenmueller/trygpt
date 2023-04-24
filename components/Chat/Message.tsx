import Image from 'next/image'
import { useRecoilValue } from 'recoil'
import cx from 'classnames'

import ChatMessage from '@/lib/chat/message'
import Markdown from '@/components/Markdown'
import SoundButton from './MessageSoundButton'
import ThreeDotsLoader from '@/components/ThreeDotsLoader'
import defaultUserImage from '@/assets/user.png'
import assistantImage from '@/assets/chatgpt.jpg'
import chatState from '@/lib/atoms/chat'

const ChatMessage = ({ message }: { message: ChatMessage }) => {
	const chat = useRecoilValue(chatState)
	if (!chat) throw new Error('Chat not found')

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
			<Markdown text={message.text} />
			{/* {message.role === 'assistant' && (
				<SoundButton className="" message={message} />
			)} */}
			{message.loading && (
				<ThreeDotsLoader className="absolute right-8 bottom-[4.8px]" />
			)}
		</article>
	)
}

export default ChatMessage
