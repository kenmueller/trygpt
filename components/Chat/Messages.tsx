'use client'

import { useRecoilValue } from 'recoil'

import Message from './Message'
import chatMessagesState from '@/lib/atoms/chatMessages'

const ChatMessages = () => {
	const messages = useRecoilValue(chatMessagesState)

	return (
		<>
			{messages?.map(message => (
				<Message key={message.id} message={message} />
			))}
		</>
	)
}

export default ChatMessages
