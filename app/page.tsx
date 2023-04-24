import { redirect } from 'next/navigation'

import userFromRequest from '@/lib/user/fromRequest'
import pageMetadata from '@/lib/metadata/page'
import Nav from '@/components/Landing/Nav'
import Header from '@/components/Landing/Header'
import Sections from '@/components/Landing/Sections'
import Footer from '@/components/Landing/Footer'

export const generateMetadata = () =>
	pageMetadata({
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
