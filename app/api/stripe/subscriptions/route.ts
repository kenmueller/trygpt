if (!process.env.STRIPE_TOKENS_PRICE_ID)
	throw new Error('Missing STRIPE_TOKENS_PRICE_ID')

import { NextRequest, NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'
import userFromRequest from '@/lib/user/fromRequest'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import stripe from '@/lib/stripe'

export const POST = async () => {
	try {
		const user = await userFromRequest()
		if (!user) throw new HttpError(ErrorCode.Unauthorized, 'Unauthorized')

		// TODO handle success_url and cancel_url
		const { url } = await stripe.checkout.sessions.create({
			customer: user.customerId,
			mode: 'subscription',
			success_url: '',
			cancel_url: '',
			line_items: [
				{
					price: process.env.STRIPE_TOKENS_PRICE_ID!
				}
			]
		})

		return new NextResponse(url)
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
