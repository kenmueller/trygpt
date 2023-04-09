if (!process.env.CHARGE_USERS_SECRET)
	throw new Error('Missing CHARGE_USERS_SECRET')

import { NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'
import stripe from '@/lib/stripe'
import verifyAuthorization from '@/lib/verifyAuthorization'
import allPayingUsers from '@/lib/user/allPaying'
import nextMonth from '@/lib/date/nextMonth'
import isSameDay from '@/lib/date/isSameDay'
import costThisPeriod from '@/lib/user/costThisPeriod'

export const dynamic = 'force-dynamic'

export const POST = async () => {
	try {
		verifyAuthorization(process.env.CHARGE_USERS_SECRET!)

		const now = new Date()

		const users = await allPayingUsers()

		const results = await Promise.allSettled(
			users.map(async user => {
				if (!user.lastCharged) return

				const scheduledCharge = nextMonth(user.lastCharged)
				if (!isSameDay(scheduledCharge, now)) return

				const invoice = await stripe.invoices.create({
					customer: user.customerId,
					collection_method: 'send_invoice',
					days_until_due: 7
				})

				await stripe.invoiceItems.create({
					customer: user.customerId,
					invoice: invoice.id,
					amount: costThisPeriod(user)
				})

				await stripe.invoices.sendInvoice(invoice.id)

				return user.id
			})
		)

		return NextResponse.json(
			results.filter(
				result => result.status === 'rejected' || result.value
			) as PromiseSettledResult<string>[]
		)
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
