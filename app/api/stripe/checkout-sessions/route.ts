if (!process.env.STRIPE_INITIAL_TOKENS_PRICE_ID)
	throw new Error('Missing STRIPE_INITIAL_TOKENS_PRICE_ID')

import { NextRequest, NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'
import stripe from '@/lib/stripe'
import userFromRequest from '@/lib/user/fromRequest'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import getUrl from '@/lib/getUrl'

export const dynamic = 'force-dynamic'

export const POST = async (request: NextRequest) => {
	try {
		const user = await userFromRequest()
		if (!user) throw new HttpError(ErrorCode.Unauthorized, 'Unauthorized')

		if (user.purchasedAmount)
			throw new HttpError(
				ErrorCode.Forbidden,
				"You've already purchased GPT 4. Reload the page to continue."
			)

		const referer = request.headers.get('referer')

		const previousUrl = referer
			? new URL(referer)
			: new URL('/chats/new', getUrl().origin)

		const successUrl = new URL(previousUrl)
		successUrl.searchParams.set('purchased', 'true')

		const cancelUrl = new URL(previousUrl)
		cancelUrl.searchParams.set('purchased', 'false')

		const { url: checkoutUrl } = await stripe.checkout.sessions.create({
			line_items: [
				{
					price: process.env.STRIPE_INITIAL_TOKENS_PRICE_ID!,
					quantity: 1,
					adjustable_quantity: { enabled: false }
				}
			],
			customer: user.customerId,
			mode: 'payment',
			payment_intent_data: { setup_future_usage: 'off_session' },
			success_url: successUrl.href,
			cancel_url: cancelUrl.href
		})

		if (!checkoutUrl)
			throw new HttpError(ErrorCode.Internal, 'Missing checkout session URL')

		return new NextResponse(checkoutUrl)
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
