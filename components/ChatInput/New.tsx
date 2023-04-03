'use client'

import { useCallback, useContext } from 'react'
import { useRouter } from 'next/navigation'

import alertError from '@/lib/error/alert'
import errorFromResponse from '@/lib/error/fromResponse'
import ChatsContext from '@/lib/context/chats'
import InitialPromptContext from '@/lib/context/initialPrompt'
import BaseChatInput from './Base'
import Chat from '@/lib/chat'

const NewChatInput = ({ userId }: { userId: string }) => {
	const router = useRouter()

	const [, setChats] = useContext(ChatsContext)
	const [, setInitialPrompt] = useContext(InitialPromptContext)

	const onSubmit = useCallback(
		async (prompt: string) => {
			try {
				const response = await fetch('/api/chats', { method: 'POST' })
				if (!response.ok) throw await errorFromResponse(response)

				const id = await response.text()

				const chat: Chat = {
					userId,
					id,
					name: null,
					created: Date.now(),
					updated: Date.now()
				}

				setChats(chats => chats && [...chats, chat])
				setInitialPrompt(prompt)

				router.push(`/chats/${encodeURIComponent(id)}`)
			} catch (unknownError) {
				alertError(unknownError)
			}
		},
		[userId, router, setChats, setInitialPrompt]
	)

	return <BaseChatInput onSubmit={onSubmit} />
}

export default NewChatInput
