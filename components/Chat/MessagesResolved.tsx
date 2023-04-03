'use client'

import { useContext, useEffect } from 'react'

import ChatMessage from '@/lib/chat/message'
import MessageText from './MessageText'
import ChatMessagesContext from '@/lib/context/chatMessages'

const ChatMessagesResolved = ({
	initialValue
}: {
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
				<MessageText key={message.id} message={message} />
			))}
		</>
	)
}

export default ChatMessagesResolved
