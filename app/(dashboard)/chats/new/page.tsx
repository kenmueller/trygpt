import { redirect } from 'next/navigation'

import pageMetadata from '@/lib/metadata/page'
import userFromRequest from '@/lib/user/fromRequest'
import BuyLink from '@/components/BuyLink'
import NewChatInput from '@/components/ChatInput/New'

import styles from './page.module.scss'

export const metadata = pageMetadata({
	path: '/chats/new',
	title: 'New Chat | TryGPT',
	description: 'New Chat | TryGPT',
	image: `/api/preview/${encodeURIComponent('New Chat')}`
})

const NewChatPage = async () => {
	const user = await userFromRequest()
	if (!user) redirect(`/?to=${encodeURIComponent('/chats/new')}`)

	return (
		<main className={styles.root}>
			<div className={styles.main}>
				<div className={styles.mainInner}>
					<h1>New Chat</h1>
					<p className={styles.model}>GPT 4</p>
					{!user.purchasedAmount && <BuyLink className={styles.buy} />}
				</div>
			</div>
			<NewChatInput user={user} />
		</main>
	)
}

export default NewChatPage
