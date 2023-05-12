'use client'

import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

import ChatPreview from '@/components/Conversation/ChatPreview'
import conversationChatMessagesState from '@/lib/atoms/conversationChatMessages'
import conversationState from '@/lib/atoms/conversation'

const ConversationPageChatPreview = () => {
	const conversation = useRecoilValue(conversationState)
	const messages = useRecoilValue(conversationChatMessagesState)

	if (!(conversation && messages))
		throw new Error('Missing conversation or messages')

	const chat = useMemo(
		() => ({ id: conversation.chatId, name: conversation.chatName }),
		[conversation]
	)

	const user = useMemo(
		() => ({ photo: conversation.userPhoto, name: conversation.userName }),
		[conversation]
	)

	return (
		<ChatPreview
			title={conversation.title}
			chat={chat}
			user={user}
			messages={messages}
		/>
	)
}

export default ConversationPageChatPreview
