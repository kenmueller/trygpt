import pageMetadata from '@/lib/metadata/page'
import NewChatInput from '@/components/NewChatInput'

import styles from './page.module.scss'

export const metadata = pageMetadata({
	path: '/chats/new',
	title: 'New Chat | TryGPT',
	description: 'New Chat | TryGPT'
})

const NewChatPage = () => (
	<main className={styles.root}>
		New Chat
		<NewChatInput />
	</main>
)

export default NewChatPage
