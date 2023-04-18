import Image from 'next/image'

import ChatMessage from '@/lib/chat/message'
import Markdown from '@/components/Markdown'
import SoundButton from './MessageSoundButton'
import { ChatWithUserData } from '@/lib/chat'
import ThreeDotsLoader from '@/components/ThreeDotsLoader'
import defaultUserImage from '@/assets/user.png'
import assistantImage from '@/assets/chatgpt.jpg'

import styles from './Message.module.scss'

const ChatMessage = ({
	chat,
	message
}: {
	chat: ChatWithUserData
	message: ChatMessage
}) => (
	<article
		className={styles.root}
		data-role={message.role}
		data-error={message.error}
	>
		<Image
			className={styles.image}
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
		{message.loading && <ThreeDotsLoader className={styles.loader} />}
	</article>
)

export default ChatMessage
