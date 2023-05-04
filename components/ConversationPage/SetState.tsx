'use client'

import { useSetRecoilState } from 'recoil'

import useImmediateEffect from '@/lib/useImmediateEffect'
import ChatMessage from '@/lib/chat/message'
import { ConversationWithUserAndChatAndPointData } from '@/lib/conversation'
import conversationState from '@/lib/atoms/conversation'
import conversationChatMessagesState from '@/lib/atoms/conversationChatMessages'

const SetConversationPageState = ({
	conversation,
	messages
}: {
	conversation: ConversationWithUserAndChatAndPointData
	messages: Promise<ChatMessage[]>
}) => {
	const setConversation = useSetRecoilState(conversationState)
	const setConversationChatMessages = useSetRecoilState(
		conversationChatMessagesState
	)

	useImmediateEffect(() => {
		setConversation(conversation)
	}, [conversation, setConversation])

	useImmediateEffect(() => {
		setConversationChatMessages(null)
		messages.then(setConversationChatMessages)
	}, [messages, setConversationChatMessages])

	return null
}

export default SetConversationPageState
