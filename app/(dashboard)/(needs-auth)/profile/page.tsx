import pageMetadata from '@/lib/metadata/page'
import userFromRequest from '@/lib/user/fromRequest'
import {
	COST_PER_1000_PROMPT_TOKENS,
	COST_PER_1000_COMPLETION_TOKENS
} from '@/lib/costPerToken'
import costThisPeriod, { baseCostThisPeriod } from '@/lib/user/costThisPeriod'
import formatDate from '@/lib/date/format'
import nextMonth from '@/lib/date/nextMonth'
import formatCents from '@/lib/cents/format'
import Refresh from '@/components/Refresh'
import Nav from '@/components/Dashboard/Nav'

export const generateMetadata = () =>
	pageMetadata({
		title: 'Profile | TryGPT',
		description: 'Profile | TryGPT',
		previewTitle: 'Profile'
	})

const ProfilePage = async () => {
	const user = await userFromRequest()
	if (!user) return null

	const baseCost = baseCostThisPeriod(user)
	const cost = costThisPeriod(user)

	const nextCharge = (() => {
		if (!user.lastCharged) return null

		const minNextCharge = nextMonth(user.lastCharged)
		const now = new Date()

		return minNextCharge > now ? minNextCharge : now
	})()

	return (
		<>
			<Nav>Profile</Nav>
			<main className="px-4 py-3 overflow-y-auto [&>*]:mt-4 [&>:first-child]:mt-0">
				<h1 className="text-4xl font-bold">Profile</h1>
				<p>Name: {user.name}</p>
				<p>Email: {user.email}</p>
				<h2 className="max-w-max text-2xl font-bold border-b-2 border-gray-500">
					Usage this period
				</h2>
				{baseCost <= 0 && (
					<p className="[&_strong]:text-[#24e098]">
						You have <strong>{formatCents(-baseCost)}</strong> remaining of your
						initial <strong>{formatCents(100)}</strong>.
					</p>
				)}
				<p className="[&_strong]:text-[#24e098]">
					Upcoming charge: <strong>{formatCents(cost)}</strong>
					{nextCharge && (
						<>
							{' '}
							on <strong>{formatDate(nextCharge)}</strong>
						</>
					)}
				</p>
				<h3 className="max-w-max text-xl font-bold border-b-2 border-gray-500">
					How we calculate price
				</h3>
				<p>
					<strong>1,000 tokens</strong> is about <strong>750 words</strong>. We
					charge <strong>{formatCents(COST_PER_1000_PROMPT_TOKENS)}</strong> for{' '}
					<strong>1,000 prompt tokens</strong> and{' '}
					<strong>{formatCents(COST_PER_1000_COMPLETION_TOKENS)}</strong> for{' '}
					<strong>1,000 response tokens</strong>.
				</p>
				<p>
					We also charge an <strong>extra $0.30 per month</strong> with a{' '}
					<strong>minimum of $0.50 per month</strong> (if you've used this
					service at all this month).
				</p>
				<h3 className="max-w-max text-xl font-bold border-b-2 border-gray-500">
					Tips for keeping cost down
				</h3>
				<p>
					Start a new chat whenever possible. Every message in the chat is
					passed back to ChatGPT as part of the prompt.
				</p>
				<Refresh />
			</main>
		</>
	)
}

export default ProfilePage
