import User from '@/lib/user'
import Nav from './Nav'

import styles from './DashboardPage.module.scss'

const DashboardPage = ({ user }: { user: User }) => (
	<main className={styles.root}>
		<Nav user={user} />
		{/* <Sidebar /> */}
	</main>
)

export default DashboardPage
