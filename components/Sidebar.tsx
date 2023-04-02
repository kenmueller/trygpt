import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import User from '@/lib/user'
import { DashboardPage } from './DashboardPage'

import styles from './Sidebar.module.scss'

const Sidebar = ({ user, page }: { user: User; page: DashboardPage }) => (
	<aside className={styles.root}>
		<Link
			className={styles.newChat}
			aria-current={page.key === 'new-chat' ? 'page' : undefined}
			href="/chats/new"
		>
			<FontAwesomeIcon className={styles.newChatIcon} icon={faPlus} />
			New Chat
		</Link>
	</aside>
)

export default Sidebar
