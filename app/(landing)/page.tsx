import { redirect } from 'next/navigation'

import userFromRequest from '@/lib/user/fromRequest'
import pageMetadata from '@/lib/metadata/page'
import Nav from './Nav'
import Header from './Header'
import Sections from './Sections'
import Footer from './Footer'

export const generateMetadata = () =>
	pageMetadata({
		title: 'ChatGPT 4 for $1 | TryGPT',
		description:
			'TryGPT is the cheapest way to get access to GPT-4 which is far, far superior to the free GPT-3.5. Start now for only $1.',
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
			<div className="bg-gradient-to-br from-[#0b2e42] to-[#169470]">
				<Nav />
				<Header />
			</div>
			<Sections />
			<Footer />
		</>
	)
}

export default LandingPage
