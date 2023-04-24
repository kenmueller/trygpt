import pageMetadata from '@/lib/metadata/page'
import userFromRequest from '@/lib/user/fromRequest'
import BuyLink from '@/components/BuyLink'
import NewChatInput from '@/components/ChatInput/New'

import styles from './page.module.scss'

export const generateMetadata = () =>
	pageMetadata({
		title: 'New Chat | TryGPT',
		description: 'New Chat | TryGPT',
		previewTitle: 'New Chat'
	})

const NewChatPage = async () => {
	const user = await userFromRequest()
	if (!user) return null

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
