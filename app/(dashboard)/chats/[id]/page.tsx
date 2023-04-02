import { redirect } from 'next/navigation'

import pageMetadata from '@/lib/metadata/page'
import userFromRequest from '@/lib/user/fromRequest'
import chatFromId from '@/lib/chat/fromId'
import User from '@/lib/user'
import ChatInput from '@/components/ChatInput'

import styles from './page.module.scss'

export const generateMetadata = async ({
	params: { id }
}: {
	params: { id: string }
}) => {
	const [user, chat] = await Promise.all([
		userFromRequest(),
		chatFromId(decodeURIComponent(id))
	])

	if (!(user && chat && user.id === chat.userId)) return {}

	return pageMetadata({
		path: `/chats/${id}`,
		title: `${chat.name ?? 'Untitled'} | TryGPT`,
		description: `${chat.name ?? 'Untitled'} | TryGPT`
	})
}

const ChatPage = async ({ params: { id } }: { params: { id: string } }) => {
	const [user, chat] = await Promise.all([
		userFromRequest() as Promise<User>,
		chatFromId(decodeURIComponent(id))
	])

	if (!(chat && user.id === chat.userId)) redirect('/chats/new')

	return (
		<main className={styles.root}>
			New Chat
			<ChatInput />
		</main>
	)
}

export default ChatPage
