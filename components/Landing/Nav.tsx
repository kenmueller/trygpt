import Link from 'next/link'

import SignInButton from '@/components/SignInButton'

import styles from './Nav.module.scss'

const LandingPageNav = () => (
	<nav className={styles.root}>
		<Link className={styles.home} href="/">
			TryGPT
		</Link>
		<div className={styles.links}>
			<a className={styles.link} href="#pricing">
				Pricing
			</a>
			<a className={styles.link} href="#features">
				Features
			</a>
		</div>
		<SignInButton className={styles.signIn} iconClassName={styles.signInIcon} />
	</nav>
)

export default LandingPageNav
