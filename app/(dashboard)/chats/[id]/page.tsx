import { Suspense } from 'react'
import { redirect } from 'next/navigation'

import pageMetadata from '@/lib/metadata/page'
import userFromRequest from '@/lib/user/fromRequest'
import chatFromId from '@/lib/chat/fromId'
import ChatInput from '@/components/ChatInput'
import ChatMessagesProvider from '@/components/Provider/ChatMessages'
import ChatMessages from '@/components/Chat/Messages'
import ChatMessagesContainer from '@/components/Chat/MessagesContainer'

import styles from './page.module.scss'

export const generateMetadata = async ({
	params: { id: encodedChatId }
}: {
	params: { id: string }
}) => {
	const chatId = decodeURIComponent(encodedChatId)
	const chat = await chatFromId(chatId)

	if (!chat)
		return pageMetadata({
			path: `/chats/${encodeURIComponent(chatId)}`,
			title: 'Chat not found | TryGPT',
			description: 'Chat not found | TryGPT'
		})

	return pageMetadata({
		path: `/chats/${encodeURIComponent(chatId)}`,
		title: `${chat.name ?? 'Untitled'} | TryGPT`,
		description: `${chat.name ?? 'Untitled'} | TryGPT`
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
