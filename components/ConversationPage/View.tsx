'use client'

import { useCallback, useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import conversationState from '@/lib/atoms/conversation'
import isBotState from '@/lib/atoms/isBot'
import alertError from '@/lib/error/alert'
import errorFromUnknown from '@/lib/error/fromUnknown'
import errorFromResponse from '@/lib/error/fromResponse'

const ConversationPageView = () => {
	const isBot = useRecoilValue(isBotState)

	const [conversation, setConversation] = useRecoilState(conversationState)
	if (!conversation) throw new Error('Missing conversation')

	const viewConversation = useCallback(async () => {
		try {
			const response = await fetch(
				`/api/conversations/${conversation.id}/view`,
				{ method: 'POST' }
			)

			if (!response.ok) throw await errorFromResponse(response)

			setConversation(
				conversation =>
					conversation && {
						...conversation,
						views: conversation.views + 1
					}
			)
		} catch (unknownError) {
			alertError(errorFromUnknown(unknownError))
		}
	}, [conversation.id, setConversation])

	useEffect(() => {
		if (!isBot) viewConversation()
	}, [isBot, viewConversation])

	return null
}

export default ConversationPageView
