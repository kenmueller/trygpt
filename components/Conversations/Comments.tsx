'use client'

if (!process.env.NEXT_PUBLIC_DISQUS_SHORTNAME)
	throw new Error('Missing NEXT_PUBLIC_DISQUS_SHORTNAME')
if (!process.env.NEXT_PUBLIC_DISQUS_HOST)
	throw new Error('Missing NEXT_PUBLIC_DISQUS_HOST')

import { useMemo } from 'react'
import { DiscussionEmbed } from 'disqus-react'
import { useRecoilState } from 'recoil'

import conversationState from '@/lib/atoms/conversation'

const ConversationComments = () => {
	const [conversation, setConversation] = useRecoilState(conversationState)
	if (!conversation) throw new Error('Missing conversation')

	const config = useMemo(
		() => ({
			identifier: conversation.id,
			url: `https://${process.env
				.NEXT_PUBLIC_DISQUS_HOST!}/conversations/${encodeURIComponent(
				conversation.id
			)}/${encodeURIComponent(conversation.slug)}`,
			title: conversation.title,
			onNewComment: () => {
				setConversation(
					conversation =>
						conversation && {
							...conversation,
							comments: conversation.comments + 1
						}
				)
			}
		}),
		[conversation.id, conversation.slug, conversation.title, setConversation]
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
