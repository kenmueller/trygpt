import Link from 'next/link'

import SignInButton from '@/components/SignInButton'

import styles from './Nav.module.scss'

const LandingPageNav = () => (
	<nav className={styles.root}>
		<Link className={styles.home} href="/">
			TryGPT
		</Link>
		<div className={styles.links}>
			<a href="#features">Features</a>
			<a href="#pricing">Pricing</a>
		</div>
		<SignInButton className={styles.signIn} iconClassName={styles.signInIcon} />
	</nav>
)

export default LandingPageNav
