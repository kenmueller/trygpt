import pageMetadata from '@/lib/metadata/page'

import styles from './page.module.scss'

export const metadata = pageMetadata({
	path: '/chats/new',
	title: 'New Chat | TryGPT',
	description: 'New Chat | TryGPT'
})

const NewChatPage = async () => <main className={styles.root}></main>

export default NewChatPage
