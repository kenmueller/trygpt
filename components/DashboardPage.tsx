import { ReactNode } from 'react'

import User from '@/lib/user'
import Sidebar from './Sidebar'

import styles from './DashboardPage.module.scss'

export type DashboardPage =
	| { key: 'new-chat' }
	| { key: 'chat'; id: string }
	| { key: 'profile' }

const DashboardPage = ({
	user,
	page,
	children
}: {
	user: User
	page: DashboardPage
	children: ReactNode
}) => (
	<main className={styles.root}>
		<Sidebar user={user} page={page} />
		<main className={styles.main}>{children}</main>
	</main>
)

export default DashboardPage
