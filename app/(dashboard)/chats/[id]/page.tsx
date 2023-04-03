import { redirect } from 'next/navigation'

import pageMetadata from '@/lib/metadata/page'
import userFromRequest from '@/lib/user/fromRequest'
import chatFromId from '@/lib/chat/fromId'
import ChatInput from '@/components/ChatInput'
import ChatMessagesProvider from '@/components/Provider/ChatMessages'
import ChatMessages from '@/components/Chat/Messages'

import styles from './page.module.scss'
import { Suspense } from 'react'

export const generateMetadata = async ({
	params: { id }
}: {
	params: { id: string }
}) => {
	const user = await userFromRequest()
	if (!user) return {}

	const chat = await chatFromId(decodeURIComponent(id))
	if (!(chat && user.id === chat.userId)) return {}

	return pageMetadata({
		path: `/chats/${id}`,
		title: `${chat.name ?? 'Untitled'} | TryGPT`,
		description: `${chat.name ?? 'Untitled'} | TryGPT`
	})
}

const ChatPage = async ({ params: { id } }: { params: { id: string } }) => {
	const user = await userFromRequest()
	if (!user) redirect('/')

	const chat = await chatFromId(decodeURIComponent(id))
	if (!(chat && user.id === chat.userId)) redirect('/chats/new')

	return (
		<ChatMessagesProvider>
			<main className={styles.root}>
				<div className={styles.main}>
					<Suspense fallback={<p className={styles.loading}>Loading...</p>}>
						{/* @ts-expect-error */}
						<ChatMessages chatId={id} />
					</Suspense>
				</div>
				<ChatInput chatId={id} />
			</main>
		</ChatMessagesProvider>
	)
}

export default ChatPage
