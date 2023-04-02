import User from '@/lib/user'

import styles from './DashboardPage.module.scss'

const DashboardPage = ({ user }: { user: User }) => (
	<main className={styles.root}>
		<pre>
			<code>{JSON.stringify(user, null, 2)}</code>
		</pre>
	</main>
)

export default DashboardPage
