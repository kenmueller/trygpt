import { Suspense } from 'react'
import { notFound, redirect } from 'next/navigation'

import conversationFromId from '@/lib/conversation/fromId'
import formatDate from '@/lib/date/format'
import pageMetadata from '@/lib/metadata/page'
import chatMessagesFromChatId from '@/lib/chat/message/fromChatId'
import ThreeDotsLoader from '@/components/ThreeDotsLoader'
import ChatPreview from '@/components/ConversationPage/ChatPreview'
import Comments from '@/components/Conversations/Comments'
import SetConversationPageState from '@/components/ConversationPage/SetState'
import Info from '@/components/ConversationPage/Info'
import Await from '@/components/Await'

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
			<SetConversationPageState
				conversation={conversation}
				messages={messages}
			/>
			<div className="max-w-[1500px] w-full flex flex-col items-stretch gap-4">
				<Info />
				<Suspense fallback={<ThreeDotsLoader className="mx-auto mt-4" />}>
					{/* @ts-expect-error */}
					<Await promise={messages}>
						<ChatPreview />
					</Await>
				</Suspense>
				<Comments />
			</div>
		</main>
	)
}

export default ConversationPage
