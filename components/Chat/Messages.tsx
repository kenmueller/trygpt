'use client'

import { useRecoilValue } from 'recoil'

import Message from './Message'
import chatMessagesState from '@/lib/atoms/chatMessages'
import chatState from '@/lib/atoms/chat'

const ChatMessages = () => {
	const chat = useRecoilValue(chatState)
	if (!chat) throw new Error('Chat not found')

	const messages = useRecoilValue(chatMessagesState)

	return (
		<>
			{messages?.map(message => (
				<Message key={message.id} chat={chat} message={message} />
			))}
		</>
	)
}

export default ChatMessages
