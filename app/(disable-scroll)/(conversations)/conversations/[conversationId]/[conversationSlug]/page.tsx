import { Suspense } from 'react'
import { notFound, redirect } from 'next/navigation'

import conversationFromId from '@/lib/conversation/fromId'
import formatDate from '@/lib/date/format'
import pageMetadata from '@/lib/metadata/page'
import chatMessagesFromChatId from '@/lib/chat/message/fromChatId'
import ThreeDotsLoader from '@/components/ThreeDotsLoader'
import ChatPreview from './ChatPreview'
import Comments from '@/components/Conversation/Comments'
import SetConversationPageState from './SetState'
import Info from './Info'
import Await from '@/components/Await'
import View from './View'
import userFromRequest from '@/lib/user/fromRequest'
import mdToText from '@/lib/md/toText'
import truncate from '@/lib/truncate'

export const generateMetadata = async ({
	params: { conversationId: encodedConversationId }
}: {
	params: { conversationId: string }
}) => {
	const conversationId = decodeURIComponent(encodedConversationId)

	const user = await userFromRequest()

	const conversation = await conversationFromId(conversationId, user)
	if (!conversation) return {}

	return pageMetadata({
		title: `${
			conversation.title || conversation.chatName || 'Untitled'
		} | Conversations | TryGPT`,
		description: [
			[
				`${conversation.points} point${conversation.points === 1 ? '' : 's'}`,
				`${conversation.views} view${conversation.views === 1 ? '' : 's'}`,
				`${conversation.comments} comment${
					conversation.comments === 1 ? '' : 's'
				}`,
				formatDate(conversation.created)
			].join(' • '),
			conversation.title ? conversation.chatName || 'Untitled' : null,
			conversation.text && truncate(mdToText(conversation.text), 300)
		]
			.filter(Boolean)
			.join(' | '),
		previewTitle: conversation.title || conversation.chatName || 'Untitled'
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

	const user = await userFromRequest()

	const conversation = await conversationFromId(conversationId, user)
	if (!conversation) notFound()

	if (conversation.slug !== conversationSlug)
		redirect(
			`/conversations/${encodeURIComponent(
				conversation.id
			)}/${encodeURIComponent(conversation.slug)}`
		)

	const messages = chatMessagesFromChatId(conversation.chatId)

	return (
		<main className="flex flex-col items-center py-4 overflow-y-auto scroll-smooth">
			<SetConversationPageState
				conversation={conversation}
				messages={messages}
			/>
			<div className="flex flex-col items-stretch gap-4 max-w-[1500px] w-[95%]">
				<Info />
				<Suspense fallback={<ThreeDotsLoader className="mx-auto mt-4" />}>
					{/* @ts-expect-error */}
					<Await promise={messages}>
						<ChatPreview />
					</Await>
				</Suspense>
				<Comments />
				<View />
			</div>
		</main>
	)
}

export default ConversationPage
