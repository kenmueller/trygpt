'use client'

import { useCallback, useContext, useEffect, useState } from 'react'
import { nanoid } from 'nanoid'

import alertError from '@/lib/error/alert'
import BaseChatInput from './Base'
import ChatMessagesContext from '@/lib/context/chatMessages'
import ChatMessage from '@/lib/chat/message'
import InitialPromptContext from '@/lib/context/initialPrompt'
import streamResponse from '@/lib/responseToGenerator'
import errorFromResponse from '@/lib/error/fromResponse'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import ChatsContext from '@/lib/context/chats'
import Chat from '@/lib/chat'

const ChatInput = ({ chatId }: { chatId: string }) => {
	const [initialPrompt, setInitialPrompt] = useContext(InitialPromptContext)
	const [, setChats] = useContext(ChatsContext)
	const [messages, setMessages] = useContext(ChatMessagesContext)

	const isMessagesLoaded = Boolean(messages)

	const [prompt, setPrompt] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const addMessage = useCallback(
		(message: ChatMessage) => {
			setMessages(messages => messages && [...messages, message])
		},
		[setMessages]
	)

	const updateMessage = useCallback(
		(id: string, transform: (message: ChatMessage) => ChatMessage) => {
			setMessages(
				messages =>
					messages &&
					messages.map(message =>
						message.id === id ? transform(message) : message
					)
			)
		},
		[setMessages]
	)

	const onSubmit = useCallback(
		async (prompt: string) => {
			try {
				setPrompt('')
				setIsLoading(true)

				const userMessage: ChatMessage = {
					chatId,
					id: nanoid(), // Random ID, does not match the server
					role: 'user',
					text: prompt,
					created: Date.now()
				}

				addMessage(userMessage)

				try {
					const response = await fetch(
						`/api/chats/${encodeURIComponent(chatId)}/messages`,
						{ method: 'POST', body: userMessage.text }
					)

					if (!response.ok) throw errorFromResponse(response)
					if (!response.body)
						throw new HttpError(ErrorCode.Internal, 'No response body')

					const responseMessage: ChatMessage = {
						chatId,
						id: nanoid(),
						role: 'assistant',
						text: '',
						created: Date.now(),
						loading: true
					}

					addMessage(responseMessage)

					try {
						for await (const chunk of streamResponse(response))
							updateMessage(responseMessage.id, message => ({
								...message,
								text: message.text + chunk
							}))
					} catch (unknownError) {
						updateMessage(responseMessage.id, message => ({
							...message,
							error: true
						}))

						throw unknownError
					} finally {
						updateMessage(responseMessage.id, message => ({
							...message,
							loading: undefined
						}))
					}
				} catch (unknownError) {
					updateMessage(userMessage.id, message => ({
						...message,
						error: true
					}))

					throw unknownError
				}
			} catch (unknownError) {
				alertError(unknownError)
			} finally {
				setIsLoading(false)
			}
		},
		[chatId, addMessage, updateMessage]
	)

	const updateChat = useCallback(
		(id: string, transform: (chat: Chat) => Chat) => {
			setChats(
				chats =>
					chats && chats.map(chat => (chat.id === id ? transform(chat) : chat))
			)
		},
		[setChats]
	)

	const updateChatName = useCallback(
		async (prompt: string) => {
			try {
				const response = await fetch(
					`/api/chats/${encodeURIComponent(chatId)}/name`,
					{ method: 'PATCH', body: prompt }
				)

				for await (const chunk of streamResponse(response))
					updateChat(chatId, chat => ({
						...chat,
						name: (chat.name ?? '') + chunk
					}))
			} catch (unknownError) {
				alertError(unknownError)
			}
		},
		[chatId, updateChat]
	)

	useEffect(() => {
		if (!(initialPrompt && isMessagesLoaded)) return

		setInitialPrompt(null)

		onSubmit(initialPrompt)
		updateChatName(initialPrompt)
	}, [
		initialPrompt,
		isMessagesLoaded,
		setInitialPrompt,
		onSubmit,
		updateChatName
	])

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
