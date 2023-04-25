'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSetRecoilState } from 'recoil'

import alertError from '@/lib/error/alert'
import errorFromResponse from '@/lib/error/fromResponse'
import BaseChatInput from './Base'
import Chat from '@/lib/chat'
import User from '@/lib/user'
import chatsState from '@/lib/atoms/chats'
import initialMessagesState from '@/lib/atoms/initialMessages'
import errorFromUnknown from '@/lib/error/fromUnknown'

const NewChatInput = ({ user }: { user: User }) => {
	const router = useRouter()

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

	return (
		<BaseChatInput
			disabledMessage={
				!user.purchasedAmount
					? 'You need to purchase tokens to create a new chat'
					: undefined
			}
			prompt={prompt}
			setPrompt={setPrompt}
			isLoading={isLoading}
			onSubmit={onSubmit}
		/>
	)
}

export default NewChatInput
