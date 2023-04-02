'use client'

import { useCallback } from 'react'

import alertError from '@/lib/error/alert'
import BaseChatInput from './Base'

const ChatInput = () => {
	const onSubmit = useCallback((prompt: string) => {
		try {
			console.log(prompt)
		} catch (unknownError) {
			alertError(unknownError)
		}
	}, [])

	return <BaseChatInput onSubmit={onSubmit} />
}

export default ChatInput
