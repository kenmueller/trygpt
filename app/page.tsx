import { redirect } from 'next/navigation'

import userFromRequest from '@/lib/user/fromRequest'
import pageMetadata from '@/lib/metadata/page'
import Nav from '@/components/Landing/Nav'
import Header from '@/components/Landing/Header'
import Sections from '@/components/Landing/Sections'

import styles from './page.module.scss'

export const dynamic = 'force-dynamic'

export const metadata = pageMetadata({
	path: '',
	title: 'ChatGPT 4 for $1 | TryGPT',
	description: 'TryGPT',
	previewTitle: 'ChatGPT 4 for $1'
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
		<>
			<div className={styles.top}>
				<Nav />
				<Header />
			</div>
			<Sections />
		</>
	)
}

export default LandingPage
