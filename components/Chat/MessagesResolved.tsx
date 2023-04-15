'use client'

import { useContext, useEffect } from 'react'

import ChatMessage from '@/lib/chat/message'
import Message from './Message'
import ChatMessagesContext from '@/lib/context/chatMessages'
import { ChatWithUserData } from '@/lib/chat'

const ChatMessagesResolved = ({
	chat,
	initialValue
}: {
	chat: ChatWithUserData
	initialValue: ChatMessage[]
}) => {
	const [_messages, setMessages] = useContext(ChatMessagesContext)
	const messages = _messages ?? initialValue

	useEffect(() => {
		setMessages(initialValue)
	}, [setMessages, initialValue])

	return (
		<>
			{messages.map(message => (
				<Message key={message.id} chat={chat} message={message} />
			))}
		</>
	)
}

export default ChatMessagesResolved
