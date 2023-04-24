import Image from 'next/image'
import { useRecoilValue } from 'recoil'

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
		<article className="" data-role={message.role} data-error={message.error}>
			<Image
				className=""
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
				<SoundButton className={styles.sound} message={message} />
			)} */}
			{message.loading && <ThreeDotsLoader className="" />}
		</article>
	)
}

export default ChatMessage
