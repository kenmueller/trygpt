'use client'

import { ReactNode, useState } from 'react'

import ChatsContext from '@/lib/context/chats'
import Chat from '@/lib/chat'

const ChatsProvider = ({
	initialValue,
	children
}: {
	initialValue: Chat[] | null
	children: ReactNode
}) => {
	const chatsState = useState(initialValue)

	return (
		<ChatsContext.Provider value={chatsState}>{children}</ChatsContext.Provider>
	)
}

export default ChatsProvider
