'use client'

import { useRecoilValue } from 'recoil'

import ChatLink from './ChatLink'
import chatsState from '@/lib/atoms/chats'

const SidebarChats = () => {
	const chats = useRecoilValue(chatsState)

	return (
		<>
			{chats.map(chat => (
				<ChatLink key={chat.id} chat={chat} />
			))}
		</>
	)
}

export default SidebarChats
