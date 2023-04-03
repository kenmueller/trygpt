'use client'

import { useCallback, useContext } from 'react'
import { nanoid } from 'nanoid'

import alertError from '@/lib/error/alert'
import BaseChatInput from './Base'
import ChatMessagesContext from '@/lib/context/chatMessages'
import ChatMessage from '@/lib/chat/message'

const ChatInput = ({ chatId }: { chatId: string }) => {
	const [, setMessages] = useContext(ChatMessagesContext)

	const onSubmit = useCallback(
		(prompt: string) => {
			try {
				const message: ChatMessage = {
					chatId,
					id: nanoid(),
					role: 'user',
					text: prompt,
					created: Date.now()
				}

				setMessages(messages => messages && [...messages, message])
			} catch (unknownError) {
				alertError(unknownError)
			}
		},
		[chatId, setMessages]
	)

	return <BaseChatInput onSubmit={onSubmit} />
}

export default ChatInput
