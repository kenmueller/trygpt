'use client'

import { useRecoilValue } from 'recoil'

import chatState from '@/lib/atoms/chat'
import Nav from '@/components/Dashboard/Nav'

const ChatPageNav = () => {
	const chat = useRecoilValue(chatState)
	return <Nav>{chat ? chat.name ?? 'Untitled' : 'Chat not found'}</Nav>
}

export default ChatPageNav
