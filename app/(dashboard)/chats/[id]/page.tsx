import { Suspense } from 'react'

import pageMetadata from '@/lib/metadata/page'
import userFromRequest from '@/lib/user/fromRequest'
import chatFromId from '@/lib/chat/fromId'
import ChatInput from '@/components/ChatInput'
import ChatMessagesProvider from '@/components/Provider/ChatMessages'
import ChatMessages from '@/components/Chat/Messages'
import ChatMessagesContainer from '@/components/Chat/MessagesContainer'

import styles from './page.module.scss'
import { notFound } from 'next/navigation'
import userFromId from '@/lib/user/fromId'

export const dynamic = 'force-dynamic'

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
		path: `/chats/${encodeURIComponent(chatId)}`,
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

	const [user, chat] = await Promise.all([
		userFromRequest(),
		chatFromId(chatId)
	])

	if (!chat) notFound()

	return (
		<ChatMessagesProvider>
			<main className={styles.root}>
				<ChatMessagesContainer className={styles.main}>
					<Suspense fallback={<p className={styles.message}>Loading...</p>}>
						{/* @ts-expect-error */}
						<ChatMessages chat={chat} />
					</Suspense>
				</ChatMessagesContainer>
				<ChatInput user={user} chat={chat} />
			</main>
		</ChatMessagesProvider>
	)
}

export default ChatPage
