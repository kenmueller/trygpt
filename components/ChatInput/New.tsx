'use client'

if (!process.env.NEXT_PUBLIC_PREVIEW_MESSAGE_LIMIT)
	throw new Error('Missing NEXT_PUBLIC_PREVIEW_MESSAGE_LIMIT')

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import alertError from '@/lib/error/alert'
import errorFromResponse from '@/lib/error/fromResponse'
import BaseChatInput from './Base'
import Chat from '@/lib/chat'
import chatsState from '@/lib/atoms/chats'
import initialMessagesState from '@/lib/atoms/initialMessages'
import errorFromUnknown from '@/lib/error/fromUnknown'
import SpeechButton from './SpeechButton'
import userState from '@/lib/atoms/user'
import formatCents from '@/lib/cents/format'
import { logEvent } from '@/lib/analytics/lazy'

const NewChatInput = () => {
	const router = useRouter()

	const user = useRecoilValue(userState)
	if (!user) throw new Error('User is not signed in')

	const setChats = useSetRecoilState(chatsState)
	const setInitialMessages = useSetRecoilState(initialMessagesState)

	const [prompt, setPrompt] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const onSubmit = useCallback(
		async (prompt: string) => {
			try {
				setPrompt('')
				setIsLoading(true)

				const response = await fetch('/api/chats', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ original: null, name: null })
				})

				if (!response.ok) throw await errorFromResponse(response)

				const id = await response.text()

				logEvent('create_chat', { chatId: id })

				const chat: Chat = {
					userId: user.id,
					id,
					name: null,
					created: Date.now(),
					updated: Date.now()
				}

				setChats(chats => chats && [chat, ...chats])
				setInitialMessages([{ role: 'user', text: prompt }])

				router.push(`/chats/${encodeURIComponent(id)}`)

				// No need to set isLoading to false because the page will be redirected
			} catch (unknownError) {
				setIsLoading(false)
				alertError(errorFromUnknown(unknownError))
			}
		},
		[user, router, setChats, setInitialMessages, setPrompt, setIsLoading]
	)

	const previewMessagesRemaining = user.purchasedAmount
		? null
		: Number.parseInt(process.env.NEXT_PUBLIC_PREVIEW_MESSAGE_LIMIT!) -
		  user.previewMessages

	return (
		<BaseChatInput
			disabledMessage={
				!user.purchasedAmount
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
			onSubmit={onSubmit}
		>
			<SpeechButton
				isTyping={isLoading}
				disabled={
					!(
						user.purchasedAmount ||
						user.previewMessages <
							Number.parseInt(process.env.NEXT_PUBLIC_PREVIEW_MESSAGE_LIMIT!)
					)
				}
				submit={onSubmit}
			/>
		</BaseChatInput>
	)
}

export default NewChatInput
