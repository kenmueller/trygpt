import { Suspense } from 'react'

import pageMetadata from '@/lib/metadata/page'
import userFromRequest from '@/lib/user/fromRequest'
import chatFromId from '@/lib/chat/fromId'
import ChatInput from '@/components/ChatInput'
import ChatMessagesProvider from '@/components/Provider/ChatMessages'
import ChatMessages from '@/components/Chat/Messages'
import ChatMessagesContainer from '@/components/Chat/MessagesContainer'

import styles from './page.module.scss'

export const dynamic = 'force-dynamic'

export const generateMetadata = async ({
	params: { id: encodedChatId }
}: {
	params: { id: string }
}) => {
	const chatId = decodeURIComponent(encodedChatId)
	const chat = await chatFromId(chatId)

	const title = chat ? chat.name ?? 'Untitled' : 'Chat not found'

	return pageMetadata({
		path: `/chats/${encodeURIComponent(chatId)}`,
		title: `${title} | TryGPT`,
		description: `${title} | TryGPT`,
		image: `/api/preview/${encodeURIComponent(title)}`
	})
}

const ChatPage = async ({
	params: { id: encodedChatId }
}: {
	params: { id: string }
}) => {
	const chatId = decodeURIComponent(encodedChatId)

	const user = await userFromRequest()
	const chat = await chatFromId(chatId)

	return (
		<ChatMessagesProvider>
			<main className={styles.root}>
				<ChatMessagesContainer className={styles.main}>
					{!chat ? (
						<p className={styles.message}>Chat not found</p>
					) : (
						<Suspense fallback={<p className={styles.message}>Loading...</p>}>
							{/* @ts-expect-error */}
							<ChatMessages chatId={chatId} />
						</Suspense>
					)}
				</ChatMessagesContainer>
				<ChatInput user={user} chat={chat} />
			</main>
		</ChatMessagesProvider>
	)
}

export default ChatPage
