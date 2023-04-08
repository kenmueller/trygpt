if (!process.env.STRIPE_WEBHOOK_SECRET)
	throw new Error('Missing STRIPE_WEBHOOK_SECRET')

import { NextRequest, NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'
import stripe from '@/lib/stripe'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'

export const dynamic = 'force-dynamic'

export const POST = async (request: NextRequest) => {
	try {
		const signature = request.headers.get('stripe-signature')

		if (!signature)
			throw new HttpError(ErrorCode.BadRequest, 'Missing Stripe signature')

		const payload = await request.text()

		const event = stripe.webhooks.constructEvent(
			payload,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET!
		)

		console.log(JSON.stringify(event, null, 2))

		return new NextResponse('')
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}