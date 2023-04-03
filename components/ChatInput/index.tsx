'use client'

import { useCallback, useContext, useEffect, useState } from 'react'
import { nanoid } from 'nanoid'

import alertError from '@/lib/error/alert'
import BaseChatInput from './Base'
import ChatMessagesContext from '@/lib/context/chatMessages'
import ChatMessage from '@/lib/chat/message'
import InitialPromptContext from '@/lib/context/initialPrompt'
import streamResponse from '@/lib/streamResponse'
import errorFromResponse from '@/lib/error/fromResponse'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'

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

				const userMessage: ChatMessage = {
					chatId,
					id: nanoid(), // Random ID, does not match the server
					role: 'user',
					text: prompt,
					created: Date.now()
				}

				setMessages(messages => messages && [...messages, userMessage])

				try {
					const response = await fetch(
						`/api/chats/${encodeURIComponent(chatId)}/messages`,
						{
							method: 'POST',
							headers: { 'content-type': 'application/json' },
							body: JSON.stringify(userMessage.text)
						}
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

					setMessages(messages => messages && [...messages, responseMessage])

					try {
						await streamResponse(response.body, chunk => {
							setMessages(
								messages =>
									messages &&
									messages.map(message =>
										message.id === responseMessage.id
											? { ...message, text: `${message.text}${chunk}` }
											: message
									)
							)
						})
					} catch (unknownError) {
						setMessages(
							messages =>
								messages &&
								messages.map(message =>
									message.id === responseMessage.id
										? { ...message, error: true }
										: message
								)
						)

						throw unknownError
					} finally {
						setMessages(
							messages =>
								messages &&
								messages.map(message =>
									message.id === responseMessage.id
										? { ...message, loading: undefined }
										: message
								)
						)
					}
				} catch (unknownError) {
					setMessages(
						messages =>
							messages &&
							messages.map(message =>
								message.id === userMessage.id
									? { ...message, error: true }
									: message
							)
					)

					throw unknownError
				}
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
