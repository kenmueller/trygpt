'use client'

import { useSetRecoilState } from 'recoil'

import useOnMount from '@/lib/useOnMount'
import chatsState from '@/lib/atoms/chats'
import Chat from '@/lib/chat'

const SetRootLayoutState = ({ chats }: { chats: Promise<Chat[]> | null }) => {
	const setChats = useSetRecoilState(chatsState)

	useOnMount(() => {
		chats?.then(setChats)
	})

	return null
}

export default SetRootLayoutState
