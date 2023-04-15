'use client'

import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/navigation'

import alertError from '@/lib/error/alert'
import errorFromResponse from '@/lib/error/fromResponse'
import ChatsContext from '@/lib/context/chats'
import InitialPromptContext from '@/lib/context/initialPrompt'
import BaseChatInput from './Base'
import Chat from '@/lib/chat'
import User, { SubscriptionStatus } from '@/lib/user'

const NewChatInput = ({ user }: { user: User }) => {
	const router = useRouter()

	const [, setChats] = useContext(ChatsContext)
	const [, setInitialPrompt] = useContext(InitialPromptContext)

	const [prompt, setPrompt] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const onSubmit = useCallback(
		async (prompt: string) => {
			try {
				setPrompt('')
				setIsLoading(true)

				const response = await fetch('/api/chats', { method: 'POST' })
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
				setInitialPrompt(prompt)

				router.push(`/chats/${encodeURIComponent(id)}`)

				// No need to set isLoading to false because the page will be redirected
			} catch (unknownError) {
				setIsLoading(false)
				alertError(unknownError)
			}
		},
		[user.id, router, setChats, setInitialPrompt, setPrompt, setIsLoading]
	)

	return (
		<BaseChatInput
			disabledMessage={
				user.subscriptionStatus != SubscriptionStatus.VALID
					? 'There was an issue with you subscription'
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
