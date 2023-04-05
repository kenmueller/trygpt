import SignInButton from '@/components/SignInButton'

import styles from './AuthButton.module.scss'

const SidebarSignInButton = () => (
	<SignInButton className={styles.root} iconClassName={styles.icon} />
)

export default SidebarSignInButton
