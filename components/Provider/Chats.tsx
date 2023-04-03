'use client'

import { ReactNode, useState } from 'react'

import ChatsContext from '@/lib/context/chats'
import Chat from '@/lib/chat'

const ChatsProvider = ({ children }: { children: ReactNode }) => {
	const chatsState = useState<Chat[] | null>(null)

	return (
		<ChatsContext.Provider value={chatsState}>{children}</ChatsContext.Provider>
	)
}

export default ChatsProvider
