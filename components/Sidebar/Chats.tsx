'use client'

import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

import ChatLink from './ChatLink'
import chatsState from '@/lib/atoms/chats'

const SidebarChats = () => {
	const chats = useRecoilValue(chatsState)

	const sortedChats = useMemo(
		() => chats && [...chats].sort((a, b) => b.updated - a.updated),
		[chats]
	)

	return (
		<div className="mt-4">
			{sortedChats?.map(chat => (
				<ChatLink key={chat.id} chat={chat} />
			))}
		</div>
	)
}

export default SidebarChats
