'use client'

if (!process.env.NEXT_PUBLIC_PREVIEW_MESSAGE_LIMIT)
	throw new Error('Missing NEXT_PUBLIC_PREVIEW_MESSAGE_LIMIT')

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
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
import ConversationButton from './ConversationButton'
import initialMessagesState, {
	InitialMessage
} from '@/lib/atoms/initialMessages'
import chatsState from '@/lib/atoms/chats'
import errorFromUnknown from '@/lib/error/fromUnknown'
import chatMessagesState from '@/lib/atoms/chatMessages'
import userState from '@/lib/atoms/user'
import chatState from '@/lib/atoms/chat'
import isSpeechStartedState from '@/lib/atoms/isSpeechStarted'
import Artyom from '@/lib/artyom'
import mdToText from '@/lib/md/toText'
import formatCents from '@/lib/cents/format'
import { logEvent } from '@/lib/analytics/lazy'
import ShareButton from './ShareButton'

const ChatInput = () => {
	const router = useRouter()

	const [user, setUser] = useRecoilState(userState)
	const [chat, setChat] = useRecoilState(chatState)

	if (!chat) throw new Error('Chat not found')

	const [initialMessages, setInitialMessages] =
		useRecoilState(initialMessagesState)
	const setChats = useSetRecoilState(chatsState)
	const [messages, setMessages] = useRecoilState(chatMessagesState)

	const [prompt, setPrompt] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const isSpeechStarted = useRecoilValue(isSpeechStartedState)
	const isSpeechStartedRef = useRef(isSpeechStarted)

	const didUnloadRef = useRef(false)

	useEffect(() => {
		isSpeechStartedRef.current = isSpeechStarted
	}, [isSpeechStartedRef, isSpeechStarted])

	const artyom = useMemo(() => {
		if (typeof window === 'undefined') return null
		return new Artyom()
	}, [])

	useEffect(() => {
		// When speech is stopped stop text-to-speech

		if (isSpeechStarted) return

		try {
			if (!artyom) throw new Error('Artyom is not initialized')
			artyom.shutUp()
		} catch (unknownError) {
			alertError(errorFromUnknown(unknownError))
		}
	}, [isSpeechStarted, artyom])

	useEffect(() => {
		// On unload stop text-to-speech

		return () => {
			try {
				if (!artyom) throw new Error('Artyom is not initialized')

				didUnloadRef.current = true
				artyom.shutUp()
			} catch (unknownError) {
				alertError(errorFromUnknown(unknownError))
			}
		}
	}, [artyom])

	const updateChat = useCallback(
		(transform: (chat: Chat) => Chat) => {
			setChat(chat => chat && (transform(chat) as ChatWithUserData))

			setChats(
				chats =>
					chats &&
					chats.map(otherChat =>
						otherChat.id === chat.id ? transform(otherChat) : otherChat
					)
			)
		},
		[chat.id, setChat, setChats]
	)

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
					logEvent('send_message', { chatId: chat.id, chatName: chat.name })

					updateChat(chat => ({ ...chat, updated: Date.now() }))

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

						if (!response.ok) throw await errorFromResponse(response)

						logEvent('response_message', {
							chatId: chat.id,
							chatName: chat.name
						})

						setUser(
							user =>
								user && { ...user, previewMessages: user.previewMessages + 1 }
						)

						let responseText = ''

						const responseMessage: ChatMessage = {
							chatId: chat.id,
							id: nanoid(),
							role: 'assistant',
							text: responseText,
							created: Date.now(),
							loading: true
						}

						addMessages([responseMessage])

						try {
							for await (const chunk of streamResponse(response)) {
								updateMessage(responseMessage.id, message => ({
									...message,
									text: message.text + chunk
								}))

								responseText += chunk
							}

							if (isSpeechStartedRef.current && !didUnloadRef.current) {
								try {
									if (!artyom) throw new Error('Artyom is not initialized')

									if (!artyom.speechSupported)
										throw new Error('Text-to-speech is not supported')

									artyom.say(mdToText(responseText))
								} catch (unknownError) {
									alertError(errorFromUnknown(unknownError))
								}
							}
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

					logEvent('continue_chat', {
						originalChatId: chat.id,
						chatId: id,
						chatName: chat.name
					})

					const newChat: Chat = {
						userId: user.id,
						id,
						name: chat.name,
						conversationId: null,
						conversationSlug: null,
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
			setUser,
			updateChat,
			addMessages,
			updateMessage,
			messages,
			setChats,
			setInitialMessages,
			router,
			isSpeechStartedRef,
			didUnloadRef,
			artyom
		]
	)

	const onSubmitPrompt = useCallback(
		(prompt: string) => {
			onSubmitMessages([{ role: 'user', text: prompt }])
		},
		[onSubmitMessages]
	)

	const updateChatName = useCallback(
		async (prompt: string) => {
			try {
				const response = await fetch(
					`/api/chats/${encodeURIComponent(chat.id)}/name`,
					{
						method: 'PATCH',
						headers: { 'content-type': 'application/json' },
						body: JSON.stringify({ type: 'prompt', value: prompt })
					}
				)

				if (!response.ok) throw await errorFromResponse(response)

				updateChat(chat => ({ ...chat, updated: Date.now() }))

				for await (const chunk of streamResponse(response))
					updateChat(chat => ({
						...chat,
						name: (chat.name ?? '') + chunk
					}))

				updateChat(chat => ({
					...chat,
					name: chat.name && trimQuotes(chat.name)
				}))
			} catch (unknownError) {
				alertError(errorFromUnknown(unknownError))
			}
		},
		[chat.id, updateChat]
	)

	const isMessagesLoaded = Boolean(messages)

	useEffect(() => {
		if (!(isMessagesLoaded && initialMessages)) return

		setInitialMessages(null)

		onSubmitMessages(initialMessages)

		if (!chat.name && initialMessages.length)
			updateChatName(initialMessages[0].text)

		// Do not include initialMessages in dependency array
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		isMessagesLoaded,
		chat,
		setInitialMessages,
		onSubmitMessages,
		updateChatName
	])

	useNewEffect(() => {
		document.title = `${chat.name ?? 'Untitled'} | TryGPT`
	}, [chat.name])

	const previewMessagesRemaining =
		!user || user.paymentMethod
			? null
			: Number.parseInt(process.env.NEXT_PUBLIC_PREVIEW_MESSAGE_LIMIT!) -
			  user.previewMessages

	return (
		<BaseChatInput
			disabledMessage={
				!user
					? 'Not signed in'
					: !user.paymentMethod
					? user.previewMessages <
					  Number.parseInt(process.env.NEXT_PUBLIC_PREVIEW_MESSAGE_LIMIT!)
						? undefined
						: `You have no free messages remaining. Purchase GPT 4 for ${formatCents(
								100
						  )} to continue.`
					: undefined
			}
			message={
				previewMessagesRemaining === null
					? ''
					: `(${previewMessagesRemaining} free messages remaining)`
			}
			prompt={prompt}
			setPrompt={setPrompt}
			isLoading={isLoading}
			onSubmit={onSubmitPrompt}
		>
			<ConversationButton chat={chat} />
			<ShareButton chat={chat} />
			<ScreenshotButton chat={chat} />
			<SpeechButton
				isTyping={isLoading}
				disabled={
					!(
						user &&
						(user.paymentMethod ||
							user.previewMessages <
								Number.parseInt(process.env.NEXT_PUBLIC_PREVIEW_MESSAGE_LIMIT!))
					)
				}
				submit={onSubmitPrompt}
			/>
		</BaseChatInput>
	)
}

export default ChatInput
