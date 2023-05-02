import { notFound, redirect } from 'next/navigation'

import conversationFromId from '@/lib/conversation/fromId'
import formatDate from '@/lib/date/format'
import pageMetadata from '@/lib/metadata/page'

export const generateMetadata = async ({
	params: { conversationId: encodedConversationId }
}: {
	params: { conversationId: string }
}) => {
	const conversationId = decodeURIComponent(encodedConversationId)

	const conversation = await conversationFromId(conversationId)
	if (!conversation) return {}

	return pageMetadata({
		title: `${conversation.title} | Conversations | TryGPT`,
		description: `${conversation.points} point${
			conversation.points === 1 ? '' : 's'
		} | ${conversation.views} view${conversation.views === 1 ? '' : 's'} | ${
			conversation.comments
		} comment${conversation.comments === 1 ? '' : 's'} | ${formatDate(
			conversation.created
		)}`,
		previewTitle: conversation.title
	})
}

const ConversationPage = async ({
	params: {
		conversationId: encodedConversationId,
		conversationSlug: encodedConversationSlug
	}
}: {
	params: {
		conversationId: string
		conversationSlug: string
	}
}) => {
	const conversationId = decodeURIComponent(encodedConversationId)
	const conversationSlug = decodeURIComponent(encodedConversationSlug)

	const conversation = await conversationFromId(conversationId)
	if (!conversation) notFound()

	if (conversation.slug !== conversationSlug)
		redirect(
			`/conversations/${encodeURIComponent(
				conversation.id
			)}/${encodeURIComponent(conversation.slug)}`
		)

	return (
		<pre>
			<code>{JSON.stringify(conversation, null, 2)}</code>
		</pre>
	)
}

export default ConversationPage
