if (!process.env.CHARGE_USERS_SECRET)
	throw new Error('Missing CHARGE_USERS_SECRET')

import { NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'
import stripe from '@/lib/stripe'
import verifyAuthorization from '@/lib/verifyAuthorization'
import allPayingUsers from '@/lib/user/allPaying'
import nextMonth from '@/lib/date/nextMonth'
import costThisPeriod from '@/lib/user/costThisPeriod'
import formatCents from '@/lib/cents/format'
import formatDate from '@/lib/date/format'

export const dynamic = 'force-dynamic'

export const POST = async () => {
	try {
		verifyAuthorization(process.env.CHARGE_USERS_SECRET!)

		const now = new Date()

		const users = await allPayingUsers()

		const results = await Promise.allSettled(
			users.map(async user => {
				if (!user.lastCharged) return 'User has never been charged'
				if (!user.paymentMethod) throw new Error('Missing payment method')

				const scheduledCharge = nextMonth(user.lastCharged)

				if (now.getTime() < scheduledCharge.getTime())
					return `User not due for charge (scheduled for ${formatDate(
						scheduledCharge
					)})`

				const amount = costThisPeriod(user)

				await stripe.paymentIntents.create({
					customer: user.customerId,
					payment_method: user.paymentMethod,
					currency: 'usd',
					amount,
					confirm: true
				})

				return `Successful charge for ${formatCents(amount)}`
			})
		)

		return NextResponse.json(
			results.map((result, index) => ({
				user: users[index],
				status: result.status === 'fulfilled' ? 'success' : 'error',
				response:
					result.status === 'fulfilled'
						? result.value
						: errorFromUnknown(result.reason).message
			}))
		)
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
