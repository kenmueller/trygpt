import pageMetadata from '@/lib/metadata/page'
import NewChatInput from '@/components/ChatInput/New'

import styles from './page.module.scss'

export const metadata = pageMetadata({
	path: '/chats/new',
	title: 'New Chat | TryGPT',
	description: 'New Chat | TryGPT'
})

const NewChatPage = () => (
	<main className={styles.root}>
		<div className={styles.main}>
			<h1 className={styles.title}>New Chat</h1>
		</div>
		<NewChatInput />
	</main>
)

export default NewChatPage
