import { redirect } from 'next/navigation'

import pageMetadata from '@/lib/metadata/page'
import userFromRequest from '@/lib/user/fromRequest'
import NewChatInput from '@/components/ChatInput/New'

import styles from './page.module.scss'

export const metadata = pageMetadata({
	path: '/chats/new',
	title: 'New Chat | TryGPT',
	description: 'New Chat | TryGPT'
})

const NewChatPage = async () => {
	const user = await userFromRequest()
	if (!user) redirect(`/?to=${encodeURIComponent('/chats/new')}`)

	return (
		<main className={styles.root}>
			<div className={styles.main}>
				<h1 className={styles.title}>New Chat</h1>
			</div>
			<NewChatInput user={user} />
		</main>
	)
}

export default NewChatPage
