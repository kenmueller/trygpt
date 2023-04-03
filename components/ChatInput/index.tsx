'use client'

import { useCallback, useContext, useEffect, useState } from 'react'
import { nanoid } from 'nanoid'

import alertError from '@/lib/error/alert'
import BaseChatInput from './Base'
import ChatMessagesContext from '@/lib/context/chatMessages'
import ChatMessage from '@/lib/chat/message'
import InitialPromptContext from '@/lib/context/initialPrompt'

const ChatInput = ({ chatId }: { chatId: string }) => {
	const [initialPrompt, setInitialPrompt] = useContext(InitialPromptContext)
	const [messages, setMessages] = useContext(ChatMessagesContext)

	const isMessagesLoaded = Boolean(messages)

	const [prompt, setPrompt] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const onSubmit = useCallback(
		async (prompt: string) => {
			try {
				setPrompt('')
				setIsLoading(true)

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
			} finally {
				setIsLoading(false)
			}
		},
		[chatId, setMessages]
	)

	useEffect(() => {
		if (!(initialPrompt && isMessagesLoaded)) return

		setInitialPrompt(null)
		onSubmit(initialPrompt)
	}, [initialPrompt, isMessagesLoaded, setInitialPrompt, onSubmit])

	return (
		<BaseChatInput
			prompt={prompt}
			setPrompt={setPrompt}
			isLoading={isLoading}
			onSubmit={onSubmit}
		/>
	)
}

export default ChatInput
