import { Suspense } from 'react'
import { notFound } from 'next/navigation'

import pageMetadata from '@/lib/metadata/page'
import chatFromId from '@/lib/chat/fromId'
import ChatInput from '@/components/ChatInput'
import ChatMessages from '@/components/Chat/Messages'
import ChatMessagesContainer from '@/components/Chat/MessagesContainer'
import chatMessagesFromChatId from '@/lib/chat/message/fromChatId'
import Await from '@/components/Await'
import SetChatPageState from '@/components/ChatPage/SetState'
import ThreeDotsLoader from '@/components/ThreeDotsLoader'
import ChatPageNav from '@/components/ChatPage/Nav'
import ChatPageContainer from '@/components/ChatPage/Container'
import ChatPagePurchaseButton from '@/components/ChatPage/PurchaseButton'

export const generateMetadata = async ({
	params: { chatId: encodedChatId }
}: {
	params: { chatId: string }
}) => {
	const chatId = decodeURIComponent(encodedChatId)

	const chat = await chatFromId(chatId)
	if (!chat) return {}

	const title = chat.name ?? 'Untitled'

	return pageMetadata({
		title: `${title} | TryGPT`,
		description: `View or continue this chat on TryGPT. TryGPT is the cheapest way to get access to GPT-4 which is far, far superior to the free GPT-3.5. Start now for only $1.`,
		previewTitle: title
	})
}

const ChatPage = async ({
	params: { chatId: encodedChatId }
}: {
	params: { chatId: string }
}) => {
	const chatId = decodeURIComponent(encodedChatId)

	const chat = await chatFromId(chatId)
	if (!chat) notFound()

	const messages = chatMessagesFromChatId(chat.id)

	return (
		<>
			<SetChatPageState chat={chat} messages={messages} />
			<ChatPageNav />
			<ChatPageContainer>
				<Suspense
					fallback={
						<div className="flex flex-col overflow-y-auto">
							<ThreeDotsLoader className="m-auto" />
						</div>
					}
				>
					{/* @ts-expect-error */}
					<Await promise={messages}>
						<ChatMessagesContainer className="flex flex-col overflow-y-auto">
							<ChatMessages />
						</ChatMessagesContainer>
					</Await>
				</Suspense>
				<ChatPagePurchaseButton />
				<ChatInput />
			</ChatPageContainer>
		</>
	)
}

export default ChatPage
