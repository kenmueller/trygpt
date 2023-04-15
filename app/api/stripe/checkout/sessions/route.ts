if (!process.env.STRIPE_INITIAL_TOKENS_PRICE_ID)
	throw new Error('Missing STRIPE_INITIAL_TOKENS_PRICE_ID')

if (!process.env.NEXT_PUBLIC_ORIGIN)
	throw new Error('Missing NEXT_PUBLIC_ORIGIN')

import { NextRequest, NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'
import stripe from '@/lib/stripe'
import userFromRequest from '@/lib/user/fromRequest'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'

export const dynamic = 'force-dynamic'

export const POST = async (_request: NextRequest) => {
	try {
		const user = await userFromRequest()
		if (!user) throw new HttpError(ErrorCode.Unauthorized, 'Unauthorized')

		const { url } = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: [
				{
					price: process.env.STRIPE_INITIAL_TOKENS_PRICE_ID!,
					quantity: 1,
					adjustable_quantity: { enabled: false }
				}
			],
			payment_intent_data: {
				setup_future_usage: 'off_session'
			},
			customer: user.customerId,
			mode: 'payment',
			success_url: `${process.env.NEXT_PUBLIC_ORIGIN!}/chats/new`,
			cancel_url: `${process.env.NEXT_PUBLIC_ORIGIN!}/chats/new`
		})

		if (!url)
			throw new HttpError(ErrorCode.Internal, 'Missing checkout session URL')

		return new NextResponse(url)
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
