import { redirect } from 'next/navigation'

import userFromRequest from '@/lib/user/fromRequest'
import SignInButton from '@/components/SignInButton'
import pageMetadata from '@/lib/metadata/page'

import styles from './page.module.scss'

export const metadata = pageMetadata({
	path: '',
	title: 'TryGPT',
	description: 'TryGPT'
})

const LandingPage = async () => {
	const user = await userFromRequest()
	if (user) redirect('/chats/new')

	return (
		<main className={styles.root}>
			<h1>TryGPT</h1>
			<p>Pay-as-you-go ChatGPT</p>
			<SignInButton />
		</main>
	)
}

export default LandingPage
