if (!process.env.NEXT_PUBLIC_ORIGIN)
	throw new Error('Missing NEXT_PUBLIC_ORIGIN')

import { redirect } from 'next/navigation'

import userFromRequest from '@/lib/user/fromRequest'
import DashboardPage from '@/components/DashboardPage'
import preview from '@/assets/preview.jpg'

import styles from './page.module.scss'

const url = `${process.env.NEXT_PUBLIC_ORIGIN}/chats/new`
const title = 'New Chat | TryGPT'
const description = 'New Chat | TryGPT'

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

const NewChatPage = async () => {
	const user = await userFromRequest()
	if (!user) redirect('/')

	return (
		<DashboardPage user={user} page={{ key: 'new-chat' }}>
			New Chat
		</DashboardPage>
	)
}

export default NewChatPage
