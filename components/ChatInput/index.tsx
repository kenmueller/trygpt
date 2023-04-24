'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRecoilState, useRecoilValue } from 'recoil'
import { nanoid } from 'nanoid'

import alertError from '@/lib/error/alert'
import BaseChatInput from './Base'
import ChatMessage from '@/lib/chat/message'
import streamResponse from '@/lib/responseToGenerator'
import errorFromResponse from '@/lib/error/fromResponse'
import Chat, { ChatWithUserData } from '@/lib/chat'
import useNewEffect from '@/lib/useNewEffect'
import trimQuotes from '@/lib/trimQuotes'
import SpeechButton from './SpeechButton'
import ScreenshotButton from './ScreenshotButton'
import initialMessagesState, {
	InitialMessage
} from '@/lib/atoms/initialMessages'
import chatsState from '@/lib/atoms/chats'
import errorFromUnknown from '@/lib/error/fromUnknown'
import chatMessagesState from '@/lib/atoms/chatMessages'
import userState from '@/lib/atoms/user'
import chatState from '@/lib/atoms/chat'

const ChatInput = () => {
	const router = useRouter()

	const user = useRecoilValue(userState)
	const [chat, setChat] = useRecoilState(chatState)

	const [initialMessages, setInitialMessages] =
		useRecoilState(initialMessagesState)
	const [chats, setChats] = useRecoilState(chatsState)
	const [messages, setMessages] = useRecoilState(chatMessagesState)

	const isMessagesLoaded = Boolean(messages)

	const [prompt, setPrompt] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const addMessages = useCallback(
		(newMessages: ChatMessage[]) => {
			setMessages(
				previousMessages =>
					previousMessages && [...previousMessages, ...newMessages]
			)
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

	const onSubmitMessages = useCallback(
		async (inputMessages: InitialMessage[]) => {
			try {
				if (!user) return

				setPrompt('')
				setIsLoading(true)

				if (user.id === chat.userId) {
					const newMessages: ChatMessage[] = inputMessages.map(
						({ role, text }) => ({
							chatId: chat.id,
							id: nanoid(), // Random ID, does not match the server
							role,
							text,
							created: Date.now()
						})
					)

					addMessages(newMessages)

					try {
						const response = await fetch(
							`/api/chats/${encodeURIComponent(chat.id)}/messages`,
							{
								method: 'POST',
								headers: { 'content-type': 'application/json' },
								body: JSON.stringify(newMessages)
							}
						)

						if (!response.ok) throw errorFromResponse(response)

						const responseMessage: ChatMessage = {
							chatId: chat.id,
							id: nanoid(),
							role: 'assistant',
							text: '',
							created: Date.now(),
							loading: true
						}

						addMessages([responseMessage])

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
						if (newMessages.length) {
							const lastNewMessage = newMessages[newMessages.length - 1]

							updateMessage(lastNewMessage.id, message => ({
								...message,
								error: true
							}))
						}

						throw unknownError
					}
				} else {
					if (!messages) return

					const response = await fetch('/api/chats', {
						method: 'POST',
						headers: { 'content-type': 'application/json' },
						body: JSON.stringify({ original: chat.id, name: chat.name })
					})

					if (!response.ok) throw await errorFromResponse(response)

					const id = await response.text()

					const newChat: Chat = {
						userId: user.id,
						id,
						name: chat.name,
						created: Date.now(),
						updated: Date.now()
					}

					setChats(chats => chats && [newChat, ...chats])
					setInitialMessages([...messages, ...inputMessages])

					router.push(`/chats/${encodeURIComponent(id)}`)
				}
			} catch (unknownError) {
				alertError(errorFromUnknown(unknownError))
			} finally {
				setIsLoading(false)
			}
		},
		[
			user,
			chat,
			addMessages,
			updateMessage,
			messages,
			setChats,
			setInitialMessages,
			router
		]
	)

	const onSubmitPrompt = useCallback(
		(prompt: string) => {
			onSubmitMessages([{ role: 'user', text: prompt }])
		},
		[onSubmitMessages]
	)

	const updateChat = useCallback(
		(id: string, transform: (chat: Chat) => Chat) => {
			setChat(chat => transform(chat) as ChatWithUserData)

			setChats(
				chats =>
					chats && chats.map(chat => (chat.id === id ? transform(chat) : chat))
			)
		},
		[setChat, setChats]
	)

	const updateChatName = useCallback(
		async (prompt: string) => {
			if (!chat.id) return

			try {
				const response = await fetch(
					`/api/chats/${encodeURIComponent(chat.id)}/name`,
					{ method: 'PATCH', body: prompt }
				)

				for await (const chunk of streamResponse(response))
					updateChat(chat.id, chat => ({
						...chat,
						name: (chat.name ?? '') + chunk
					}))

				updateChat(chat.id, chat => ({
					...chat,
					name: chat.name && trimQuotes(chat.name)
				}))
			} catch (unknownError) {
				alertError(errorFromUnknown(unknownError))
			}
		},
		[chat, updateChat]
	)

	useEffect(() => {
		if (!(initialMessages && isMessagesLoaded)) return

		setInitialMessages(null)

		onSubmitMessages(initialMessages)

		if (!chat.name && initialMessages.length)
			updateChatName(initialMessages[0].text)

		// Do not include `initialMessages` in the dependency array
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		chat,
		isMessagesLoaded,
		setInitialMessages,
		onSubmitMessages,
		updateChatName
	])

	useNewEffect(() => {
		document.title = `${chat.name ?? 'Untitled'} | TryGPT`
	}, [chat.name])

	return (
		<BaseChatInput
			disabledMessage={
				!user
					? 'Not signed in'
					: !user.purchasedAmount
					? 'You have no tokens'
					: undefined
			}
			prompt={prompt}
			setPrompt={setPrompt}
			isLoading={isLoading}
			onSubmit={onSubmitPrompt}
		>
			{/* <SpeechButton disabled={isLoading} submit={onSubmitPrompt} />
			<ScreenshotButton chatName={chatName} /> */}
		</BaseChatInput>
	)
}

export default ChatInput
