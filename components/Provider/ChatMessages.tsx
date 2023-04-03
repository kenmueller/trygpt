'use client'

import { ReactNode, useState } from 'react'

import ChatMessagesContext from '@/lib/context/chatMessages'
import ChatMessage from '@/lib/chat/message'

const ChatMessagesProvider = ({ children }: { children: ReactNode }) => {
	const chatMessagesState = useState<ChatMessage[] | null>(null)

	return (
		<ChatMessagesContext.Provider value={chatMessagesState}>
			{children}
		</ChatMessagesContext.Provider>
	)
}

export default ChatMessagesProvider
