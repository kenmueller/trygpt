'use client'

import { useRecoilValue } from 'recoil'

import ChatLink from './ChatLink'
import sortedChatsState from '@/lib/atoms/sortedChats'

const SidebarChats = () => {
	const sortedChats = useRecoilValue(sortedChatsState)

	return (
		<div className="mt-4">
			{sortedChats?.map(chat => (
				<ChatLink key={chat.id} chat={chat} />
			))}
		</div>
	)
}

export default SidebarChats
