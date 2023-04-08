import { redirect } from 'next/navigation'

import pageMetadata from '@/lib/metadata/page'
import userFromRequest from '@/lib/user/fromRequest'
import {
	COST_PER_1000_REQUEST_TOKENS,
	COST_PER_1000_RESPONSE_TOKENS
} from '@/lib/costPerToken'

import styles from './page.module.scss'
import costThisPeriod from '@/lib/user/costThisPeriod'

export const metadata = pageMetadata({
	path: '/profile',
	title: 'Profile | TryGPT',
	description: 'Profile | TryGPT',
	image: `/api/preview/${encodeURIComponent('Profile')}`
})

const ProfilePage = async () => {
	const user = await userFromRequest()
	if (!user) redirect(`/?to=${encodeURIComponent('/profile')}`)

	return (
		<main className={styles.root}>
			<h1>Profile</h1>
			<p>Name: {user.name}</p>
			<p>Email: {user.email}</p>
			<h2>Usage this period</h2>
			<p>Cost: ${costThisPeriod(user) / 100}</p>
			<h3>How we calculate price</h3>
			<p>
				1,000 tokens is about 750 words. We charge $
				{COST_PER_1000_REQUEST_TOKENS / 100} for 1,000 prompt tokens and $
				{COST_PER_1000_RESPONSE_TOKENS / 100} for 1,000 response tokens.
			</p>
			<p>
				We also charge an extra $0.30 with a minimum of $0.50 per month (if
				you've used this service at all).
			</p>
			<h3>Tips for keeping cost down</h3>
			<p>
				Start a new chat whenever possible. Every message in the chat is passed
				back to ChatGPT as a prompt.
			</p>
		</main>
	)
}

export default ProfilePage
