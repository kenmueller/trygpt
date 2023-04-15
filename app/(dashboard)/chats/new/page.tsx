import { redirect } from 'next/navigation'

import pageMetadata from '@/lib/metadata/page'
import userFromRequest from '@/lib/user/fromRequest'
import BuyLink from '@/components/BuyLink'
import NewChatInput from '@/components/ChatInput/New'

import styles from './page.module.scss'
import { SubscriptionStatus } from '@/lib/user'

export const dynamic = 'force-dynamic'

export const metadata = pageMetadata({
	path: '/chats/new',
	title: 'New Chat | TryGPT',
	description: 'New Chat | TryGPT',
	previewTitle: 'New Chat'
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
					{user.subscriptionId == null && <BuyLink className={styles.buy} />}
					{user.subscriptionStatus == SubscriptionStatus.INVALID && <p>There was some error with your subscription</p>}
				</div>
			</div>
			<NewChatInput user={user} />
		</main>
	)
}

export default NewChatPage
