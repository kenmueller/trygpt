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
import Nav from '@/components/ChatPage/Nav'

export const generateMetadata = async ({
	params: { id: encodedChatId }
}: {
	params: { id: string }
}) => {
	const chatId = decodeURIComponent(encodedChatId)

	const chat = await chatFromId(chatId)
	if (!chat) return {}

	const title = chat.name ?? 'Untitled'

	return pageMetadata({
		title: `${title} | TryGPT`,
		description: `${title} | TryGPT`,
		previewTitle: title
	})
}

const ChatPage = async ({
	params: { id: encodedChatId }
}: {
	params: { id: string }
}) => {
	const chatId = decodeURIComponent(encodedChatId)

	const chat = await chatFromId(chatId)
	if (!chat) notFound()

	const messages = chatMessagesFromChatId(chat.id)

	return (
		<>
			<SetChatPageState chat={chat} messages={messages} />
			<Nav />
			<main className="grid grid-rows-[1fr_auto] overflow-y-auto">
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
				<ChatInput />
			</main>
		</>
	)
}

export default ChatPage
