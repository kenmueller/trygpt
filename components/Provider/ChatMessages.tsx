'use client'

import { ReactNode, useState } from 'react'

import ChatMessagesContext from '@/lib/context/chatMessages'
import ChatMessage from '@/lib/chat/message'

const ChatMessagesProvider = ({
	initialValue,
	children
}: {
	initialValue: ChatMessage[] | null
	children: ReactNode
}) => {
	const chatMessagesState = useState(initialValue)

	return (
		<ChatMessagesContext.Provider value={chatMessagesState}>
			{children}
		</ChatMessagesContext.Provider>
	)
}

export default ChatMessagesProvider
