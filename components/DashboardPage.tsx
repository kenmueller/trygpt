import User from '@/lib/user'
import Nav from './Nav'
import Sidebar from './Sidebar'

import styles from './DashboardPage.module.scss'

const DashboardPage = ({ user }: { user: User }) => (
	<main className={styles.root}>
		<Nav user={user} />
		<Sidebar user={user} />
		<main className={styles.main}>
			<h1>Dashboard</h1>
		</main>
	</main>
)

export default DashboardPage
