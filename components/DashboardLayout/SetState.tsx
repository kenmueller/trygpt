'use client'

import { useSetRecoilState } from 'recoil'

import useImmediateEffect from '@/lib/useImmediateEffect'
import chatsState from '@/lib/atoms/chats'
import Chat from '@/lib/chat'

const SetRootLayoutState = ({ chats }: { chats: Promise<Chat[]> | null }) => {
	const setChats = useSetRecoilState(chatsState)

	useImmediateEffect(() => {
		setChats(null)
		chats?.then(setChats)
	}, [chats, setChats])

	return null
}

export default SetRootLayoutState
