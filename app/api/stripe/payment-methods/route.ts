import { NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'
import stripe from '@/lib/stripe'
import userFromRequest from '@/lib/user/fromRequest'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import costThisPeriod from '@/lib/user/costThisPeriod'
import updateUser from '@/lib/user/update'

export const dynamic = 'force-dynamic'

export const DELETE = async () => {
	try {
		const user = await userFromRequest()
		if (!user) throw new HttpError(ErrorCode.Unauthorized, 'Unauthorized')

		if (!user.customerId)
			throw new HttpError(ErrorCode.Forbidden, 'Missing customer ID')

		if (!user.paymentMethod)
			throw new HttpError(ErrorCode.BadRequest, 'You have no payment methods')

		const remainingAmount = costThisPeriod(user)

		if (remainingAmount)
			await stripe.paymentIntents.create({
				customer: user.customerId,
				payment_method: user.paymentMethod,
				currency: 'usd',
				amount: remainingAmount,
				confirm: true
			})

		await stripe.paymentMethods.detach(user.paymentMethod)

		await updateUser(user.id, {
			paymentMethod: null
		})

		return new NextResponse('')
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
