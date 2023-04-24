import pageMetadata from '@/lib/metadata/page'
import userFromRequest from '@/lib/user/fromRequest'
import {
	COST_PER_1000_PROMPT_TOKENS,
	COST_PER_1000_COMPLETION_TOKENS
} from '@/lib/costPerToken'
import costThisPeriod from '@/lib/user/costThisPeriod'
import formatDate from '@/lib/date/format'
import nextMonth from '@/lib/date/nextMonth'
import formatCents from '@/lib/cents/format'
import Refresh from '@/components/Refresh'

export const generateMetadata = () =>
	pageMetadata({
		title: 'Profile | TryGPT',
		description: 'Profile | TryGPT',
		previewTitle: 'Profile'
	})

const ProfilePage = async () => {
	const user = await userFromRequest()
	if (!user) return null

	return (
		<main className="px-4 py-3 [&>*]:mt-4 [&>:first-child]:mt-0">
			<h1 className="text-4xl font-bold">Profile</h1>
			<p>Name: {user.name}</p>
			<p>Email: {user.email}</p>
			<h2 className="text-2xl font-bold">Usage this period</h2>
			<p>Cost: {formatCents(costThisPeriod(user))}</p>
			{user.lastCharged && (
				<p>Charged on {formatDate(nextMonth(user.lastCharged))}</p>
			)}
			<h3 className="text-xl font-bold">How we calculate price</h3>
			<p>
				1,000 tokens is about 750 words. We charge{' '}
				{formatCents(COST_PER_1000_PROMPT_TOKENS)} for 1,000 prompt tokens and{' '}
				{formatCents(COST_PER_1000_COMPLETION_TOKENS)} for 1,000 response
				tokens.
			</p>
			<p>
				We also charge an extra $0.30 per month with a minimum of $0.50 per
				month (if you've used this service at all this month).
			</p>
			<h3 className="text-xl font-bold">Tips for keeping cost down</h3>
			<p>
				Start a new chat whenever possible. Every message in the chat is passed
				back to ChatGPT as part of the prompt.
			</p>
			<Refresh />
		</main>
	)
}

export default ProfilePage
