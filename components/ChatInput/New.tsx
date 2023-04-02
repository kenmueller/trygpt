'use client'

import { useCallback, useContext } from 'react'
import { useRouter } from 'next/navigation'

import alertError from '@/lib/error/alert'
import errorFromResponse from '@/lib/error/fromResponse'
import InitialPromptContext from '@/lib/initialPrompt/context'
import BaseChatInput from './Base'

const NewChatInput = () => {
	const router = useRouter()
	const [, setInitialPrompt] = useContext(InitialPromptContext)

	const onSubmit = useCallback(
		async (prompt: string) => {
			try {
				const response = await fetch('/api/chats', { method: 'POST' })
				if (!response.ok) throw await errorFromResponse(response)

				const id = await response.text()

				setInitialPrompt(prompt)
				router.push(`/chats/${encodeURIComponent(id)}`)
			} catch (unknownError) {
				alertError(unknownError)
			}
		},
		[router, setInitialPrompt]
	)

	return <BaseChatInput onSubmit={onSubmit} />
}

export default NewChatInput
