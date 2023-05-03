'use client'

import { useRecoilValue } from 'recoil'

import Message from './Message'
import chatMessagesState from '@/lib/atoms/chatMessages'
import chatState from '@/lib/atoms/chat'
import User from '@/lib/user'

const ChatMessages = () => {
	const chat = useRecoilValue(chatState)
	if (!chat) throw new Error('Chat not found')

	const messages = useRecoilValue(chatMessagesState)

	const user: Pick<User, 'photo' | 'name'> = {
		photo: chat.userPhoto,
		name: chat.userName
	}

	return (
		<>
			{messages?.map(message => (
				<Message key={message.id} user={user} message={message} />
			))}
		</>
	)
}

export default ChatMessages
