'use client'

import { useSetRecoilState } from 'recoil'

import useOnMount from '@/lib/useOnMount'
import { ChatWithUserData } from '@/lib/chat'
import ChatMessage from '@/lib/chat/message'
import chatState from '@/lib/atoms/chat'
import chatMessagesState from '@/lib/atoms/chatMessages'

const SetChatPageState = ({
	chat,
	messages
}: {
	chat: ChatWithUserData
	messages: Promise<ChatMessage[]>
}) => {
	const setChat = useSetRecoilState(chatState)
	const setChatMessages = useSetRecoilState(chatMessagesState)

	useOnMount(() => {
		setChat(chat)
		messages.then(setChatMessages)
	})

	return null
}

export default SetChatPageState
