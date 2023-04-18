'use client'

import { useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { nanoid } from 'nanoid'

import alertError from '@/lib/error/alert'
import BaseChatInput from './Base'
import ChatMessagesContext from '@/lib/context/chatMessages'
import ChatMessage from '@/lib/chat/message'
import InitialMessagesContext, {
	InitialMessage
} from '@/lib/context/initialMessages'
import streamResponse from '@/lib/responseToGenerator'
import errorFromResponse from '@/lib/error/fromResponse'
import ChatsContext from '@/lib/context/chats'
import Chat from '@/lib/chat'
import useNewEffect from '@/lib/useNewEffect'
import User from '@/lib/user'
import trimQuotes from '@/lib/trimQuotes'
import SpeechButton from './SpeechButton'
import ScreenshotButton from './ScreenshotButton'

const ChatInput = ({ user, chat }: { user: User | null; chat: Chat }) => {
	const router = useRouter()

	const [initialMessages, setInitialMessages] = useContext(
		InitialMessagesContext
	)
	const [chats, setChats] = useContext(ChatsContext)
	const [messages, setMessages] = useContext(ChatMessagesContext)

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
				alertError(unknownError)
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
			setChats(
				chats =>
					chats && chats.map(chat => (chat.id === id ? transform(chat) : chat))
			)
		},
		[setChats]
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
				alertError(unknownError)
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

	const chatName =
		chats?.find(otherChat => otherChat.id === chat.id)?.name ?? 'Untitled'

	useNewEffect(() => {
		document.title = `${chatName ?? 'Chat not found'} | TryGPT`
	}, [chatName])

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
			<SpeechButton disabled={isLoading} submit={onSubmitPrompt} />
			<ScreenshotButton chatName={chatName} />
		</BaseChatInput>
	)
}

export default ChatInput
