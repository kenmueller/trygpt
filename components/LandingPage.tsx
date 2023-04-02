import SignInButton from '@/components/SignInButton'

import styles from './LandingPage.module.scss'

const LandingPage = () => (
	<main className={styles.root}>
		<h1>TryGPT</h1>
		<p>Pay-as-you-go ChatGPT</p>
		<SignInButton />
	</main>
)

export default LandingPage
