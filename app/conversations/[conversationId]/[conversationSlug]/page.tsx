import { Suspense } from 'react'
import { notFound, redirect } from 'next/navigation'

import conversationFromId from '@/lib/conversation/fromId'
import formatDate from '@/lib/date/format'
import pageMetadata from '@/lib/metadata/page'
import chatMessagesFromChatId from '@/lib/chat/message/fromChatId'
import Markdown from '@/components/Markdown'
import ThreeDotsLoader from '@/components/ThreeDotsLoader'
import ChatPreview from '@/components/ConversationPage/ChatPreview'

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
		} • ${conversation.views} view${conversation.views === 1 ? '' : 's'} • ${
			conversation.comments
		} comment${conversation.comments === 1 ? '' : 's'} • ${formatDate(
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

	const messages = chatMessagesFromChatId(conversation.chatId)

	return (
		<main className="flex flex-col items-center px-6 py-4 overflow-y-auto">
			<div className="max-w-[1500px] w-full flex flex-col items-stretch gap-4">
				<div className="flex flex-col items-stretch gap-2">
					<h1>{conversation.title}</h1>
					<p className="font-bold text-white text-opacity-50">
						{conversation.points} point{conversation.points === 1 ? '' : 's'} •{' '}
						{conversation.views} view{conversation.views === 1 ? '' : 's'} •{' '}
						<a className="hover:underline" href="#comments">
							{conversation.comments} comment
							{conversation.comments === 1 ? '' : 's'}
						</a>{' '}
						• {formatDate(conversation.created)}
					</p>
				</div>
				{conversation.text && <Markdown text={conversation.text} />}
				<Suspense fallback={<ThreeDotsLoader className="mx-auto mt-4" />}>
					{/* @ts-expect-error */}
					<ChatPreview conversation={conversation} messages={messages} />
				</Suspense>
			</div>
		</main>
	)
}

export default ConversationPage
