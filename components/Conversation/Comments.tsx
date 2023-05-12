'use client'

if (!process.env.NEXT_PUBLIC_DISQUS_SHORTNAME)
	throw new Error('Missing NEXT_PUBLIC_DISQUS_SHORTNAME')
if (!process.env.NEXT_PUBLIC_DISQUS_HOST)
	throw new Error('Missing NEXT_PUBLIC_DISQUS_HOST')

import { useCallback, useMemo } from 'react'
import { DiscussionEmbed } from 'disqus-react'
import { useRecoilState } from 'recoil'

import conversationState from '@/lib/atoms/conversation'
import alertError from '@/lib/error/alert'
import errorFromUnknown from '@/lib/error/fromUnknown'
import errorFromResponse from '@/lib/error/fromResponse'

const ConversationComments = () => {
	const [conversation, setConversation] = useRecoilState(conversationState)
	if (!conversation) throw new Error('Missing conversation')

	const updateComments = useCallback(async () => {
		try {
			const response = await fetch(
				`/api/conversations/${encodeURIComponent(conversation.id)}/comments`,
				{ method: 'POST' }
			)

			if (!response.ok) throw await errorFromResponse(response)
		} catch (unknownError) {
			alertError(errorFromUnknown(unknownError))
		}
	}, [conversation.id])

	const config = useMemo(
		() => ({
			identifier: conversation.id,
			url: `https://${process.env
				.NEXT_PUBLIC_DISQUS_HOST!}/conversations/${encodeURIComponent(
				conversation.id
			)}/${encodeURIComponent(conversation.slug)}`,
			title: conversation.title || conversation.chatName || 'Untitled',
			onNewComment: () => {
				setConversation(
					conversation =>
						conversation && {
							...conversation,
							comments: conversation.comments + 1
						}
				)

				updateComments()
			}
		}),
		[
			conversation.id,
			conversation.slug,
			conversation.title,
			conversation.chatName,
			setConversation,
			updateComments
		]
	)

	return (
		<div id="comments">
			<DiscussionEmbed
				shortname={process.env.NEXT_PUBLIC_DISQUS_SHORTNAME!}
				config={config}
			/>
		</div>
	)
}

export default ConversationComments
