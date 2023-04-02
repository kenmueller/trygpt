import { Suspense } from 'react'

import User from '@/lib/user'
import chatsFromUserId from '@/lib/chat/fromUserId'
import NewChatLink from './NewChatLink'
import Chats from './Chats'
import ProfileLink from './ProfileLink'
import SignOutButton from './SignOutButton'

import styles from './index.module.scss'

const Sidebar = ({ user }: { user: User }) => {
	const chats = chatsFromUserId(user.id)

	return (
		<aside className={styles.root}>
			<div className={styles.scrollable}>
				<NewChatLink />
				<Suspense fallback={<p>Loading...</p>}>
					{/* @ts-expect-error */}
					<Chats chats={chats} />
				</Suspense>
			</div>
			<div className={styles.settings}>
				<ProfileLink user={user} />
				<SignOutButton />
			</div>
		</aside>
	)
}

export default Sidebar
