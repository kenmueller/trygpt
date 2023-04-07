import { redirect } from 'next/navigation'

import userFromRequest from '@/lib/user/fromRequest'
import SignInButton from '@/components/SignInButton'
import pageMetadata from '@/lib/metadata/page'

import styles from './page.module.scss'

export const dynamic = 'force-dynamic'

export const metadata = pageMetadata({
	path: '',
	title: 'TryGPT',
	description: 'TryGPT',
	image: `/api/preview/${encodeURIComponent('ChatGPT 4 for $1')}`
})

const LandingPage = async ({
	searchParams: { to: toEncoded }
}: {
	searchParams: { to?: string }
}) => {
	const to = toEncoded && decodeURIComponent(toEncoded)

	const user = await userFromRequest()
	if (user) redirect(to || '/chats/new')

	return (
		<main className={styles.root}>
			<h1>TryGPT</h1>
			<p>Pay-as-you-go ChatGPT</p>
			<SignInButton />
		</main>
	)
}

export default LandingPage
