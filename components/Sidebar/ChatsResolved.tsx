'use client'

import { useContext, useEffect } from 'react'

import Chat from '@/lib/chat'
import ChatLink from './ChatLink'
import ChatsContext from '@/lib/context/chats'

const SidebarChatsResolved = ({ initialValue }: { initialValue: Chat[] }) => {
	const [_chats, setChats] = useContext(ChatsContext)
	const chats = _chats ?? initialValue

	useEffect(() => {
		setChats(initialValue)
	}, [setChats, initialValue])

	return (
		<>
			{chats.map(chat => (
				<ChatLink key={chat.id} chat={chat} />
			))}
		</>
	)
}

export default SidebarChatsResolved
