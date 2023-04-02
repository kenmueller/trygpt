import User from '@/lib/user'

import styles from './Sidebar.module.scss'

const Sidebar = ({ user }: { user: User }) => (
	<aside className={styles.root}>Sidebar</aside>
)

export default Sidebar
