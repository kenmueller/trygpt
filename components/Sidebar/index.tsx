import { usePathname } from 'next/navigation'

import User from '@/lib/user'
import NewChatLink from './NewChatLink'

import styles from './index.module.scss'

const Sidebar = ({ user }: { user: User }) => {
	return (
		<aside className={styles.root}>
			<NewChatLink />
		</aside>
	)
}

export default Sidebar
