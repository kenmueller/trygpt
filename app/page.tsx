if (!process.env.NEXT_PUBLIC_ORIGIN)
	throw new Error('Missing NEXT_PUBLIC_ORIGIN')

import userFromRequest from '@/lib/user/fromRequest'
import DashboardPage from '@/components/DashboardPage'
import LandingPage from '@/components/LandingPage'
import preview from '@/assets/preview.jpg'

const url = process.env.NEXT_PUBLIC_ORIGIN
const title = 'TryGPT'
const description = 'TryGPT'

export const metadata = {
	alternates: { canonical: url },
	title,
	description,
	openGraph: {
		type: 'website',
		title,
		description,
		siteName: 'TryGPT',
		locale: 'en_US',
		url,
		images: preview,
		countryName: 'United States'
	},
	twitter: {
		card: 'summary_large_image',
		site: '@trygpt',
		creator: '@trygpt',
		title,
		description,
		images: preview
	}
}

const IndexPage = async () => {
	const user = await userFromRequest()
	return user ? <DashboardPage user={user} /> : <LandingPage />
}

export default IndexPage
