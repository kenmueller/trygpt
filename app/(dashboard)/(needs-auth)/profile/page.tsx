import { Suspense } from 'react'

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
import UpdatePaymentMethodButton from '@/components/Payment/UpdatePaymentMethodButton'
import RemovePaymentMethodButton from '@/components/Payment/RemovePaymentMethodButton'
import PurchaseButton from '@/components/Payment/PurchaseButton'
import ThreeDotsLoader from '@/components/ThreeDotsLoader'
import PaymentMethod from '@/components/Profile/PaymentMethod'
import PaymentMethodErrorBoundary from '@/components/Profile/PaymentMethodErrorBoundary'

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
		if (!(user.paymentMethod && user.lastCharged)) return null

		const minNextCharge = nextMonth(user.lastCharged)
		const now = new Date()

		return minNextCharge > now ? minNextCharge : now
	})()

	return (
		<>
			<Nav>Profile</Nav>
			<main className="flex flex-col items-start gap-4 px-4 py-3 overflow-y-auto">
				<h1 className="text-4xl font-bold border-b-2 border-gray-500">
					Profile
				</h1>
				<p>Name: {user.name}</p>
				<p>Email: {user.email}</p>
				<h2 className="text-2xl font-bold border-b-2 border-gray-500">
					Payment info
				</h2>
				<p>
					Card on file:{' '}
					{user.paymentMethod ? (
						<PaymentMethodErrorBoundary>
							<Suspense fallback={<ThreeDotsLoader />}>
								{/* @ts-expect-error */}
								<PaymentMethod paymentMethodId={user.paymentMethod} />
							</Suspense>
						</PaymentMethodErrorBoundary>
					) : (
						<code>
							<strong>none</strong>
						</code>
					)}
				</p>
				{!user.paymentMethod ? (
					<PurchaseButton className="flex flex-col justify-center items-center w-60 h-10 font-bold bg-sky-500 rounded-lg transition-opacity ease-linear hover:opacity-70" />
				) : (
					<div className="flex flex-col w-550:flex-row items-center gap-4">
						<UpdatePaymentMethodButton className="flex flex-col justify-center items-center w-60 h-10 font-bold bg-sky-500 rounded-lg transition-opacity ease-linear hover:opacity-70" />
						<RemovePaymentMethodButton
							className="flex flex-col justify-center items-center w-60 h-10 font-bold bg-red-500 rounded-lg transition-opacity ease-linear hover:opacity-70"
							remainingCost={cost}
						/>
					</div>
				)}
				<h2 className="text-2xl font-bold border-b-2 border-gray-500">
					Usage this period
				</h2>
				{user.paymentMethod && baseCost <= 0 && (
					<div className="flex flex-col gap-1">
						<p className="[&_strong]:text-[#24e098]">
							You have <strong>{formatCents(-baseCost)}</strong> remaining of
							your initial <strong>{formatCents(100)}</strong>.{' '}
						</p>
						<p
							className="underline"
							aria-label={`We take a ${formatCents(
								30
							)} + 2.9% fee out of all transactions`}
							data-balloon-pos="up"
						>
							Why did I only start out with {formatCents(67)}?
						</p>
					</div>
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
				<h3 className="text-xl font-bold border-b-2 border-gray-500">
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
					We also charge an{' '}
					<strong>extra {formatCents(30)} + 2.9% per month</strong> with a{' '}
					<strong>minimum of {formatCents(50)} per month</strong> (if you've
					used this service at all this month).
				</p>
				<h3 className="text-xl font-bold border-b-2 border-gray-500">
					Tips for keeping cost down
				</h3>
				<p>
					Start a new chat whenever possible. Every message in the chat is
					passed back to ChatGPT as part of the prompt.
				</p>
			</main>
			<Refresh /> {/* Refresh cost */}
		</>
	)
}

export default ProfilePage
