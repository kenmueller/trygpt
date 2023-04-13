import Image from 'next/image'

import SignInButton from '@/components/SignInButton'
import chatImage from '@/assets/chat.png'

import styles from './Header.module.scss'

const LandingPageHeader = () => (
	<header className={styles.root}>
		<h1 className={styles.title}>
			ChatGPT <strong>4</strong> for <strong>$1</strong>
		</h1>
		<p className={styles.description}>
			TryGPT is a pay-as-you-go service for ChatGPT 4. Start now for only $1.
		</p>
		<Image className={styles.image} src={chatImage} alt="Chat" priority />
		<SignInButton className={styles.signIn} iconClassName={styles.signInIcon} />
	</header>
)

export default LandingPageHeader
