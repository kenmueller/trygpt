'use client'

import { useSetRecoilState } from 'recoil'

import useImmediateEffect from '@/lib/useImmediateEffect'
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

	useImmediateEffect(() => {
		setChat(chat)
		messages.then(setChatMessages)
	}, [chat, messages, setChat, setChatMessages])

	return null
}

export default SetChatPageState
