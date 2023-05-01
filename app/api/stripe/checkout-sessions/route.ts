if (!process.env.STRIPE_GPT_4_PRICE_ID)
	throw new Error('Missing STRIPE_GPT_4_PRICE_ID')

import { NextRequest, NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'
import stripe from '@/lib/stripe'
import userFromRequest from '@/lib/user/fromRequest'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import getUrl from '@/lib/getUrl'

export const dynamic = 'force-dynamic'

type CreateCheckoutSessionData =
	| { mode: 'payment'; item: 'gpt-4' }
	| { mode: 'setup' }

export const POST = async (request: NextRequest) => {
	try {
		const url = getUrl()

		const user = await userFromRequest()
		if (!user) throw new HttpError(ErrorCode.Unauthorized, 'Unauthorized')

		if (request.headers.get('content-type') !== 'application/json')
			throw new HttpError(ErrorCode.BadRequest, 'Invalid content type')

		const data: CreateCheckoutSessionData = await request.json()

		if (
			!(
				typeof data === 'object' &&
				data &&
				((data.mode === 'payment' && ['gpt-4'].includes(data.item)) ||
					data.mode === 'setup')
			)
		)
			throw new HttpError(ErrorCode.BadRequest, 'Invalid data')

		switch (data.mode) {
			case 'payment': {
				if (user.paymentMethod)
					throw new HttpError(
						ErrorCode.Forbidden,
						"You've already purchased GPT 4. Reload the page to continue."
					)

				const referer = request.headers.get('referer')

				const previousUrl = referer
					? new URL(referer)
					: new URL('/chats/new', url.origin)

				const successUrl = new URL(previousUrl)
				successUrl.searchParams.set('purchased-gpt-4', 'true')

				const cancelUrl = new URL(previousUrl)
				cancelUrl.searchParams.set('purchased-gpt-4', 'false')

				const { url: checkoutUrl } = await stripe.checkout.sessions.create({
					line_items: [
						{
							price: process.env.STRIPE_GPT_4_PRICE_ID!,
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
					throw new HttpError(
						ErrorCode.Internal,
						'Missing checkout session URL'
					)

				return new NextResponse(checkoutUrl)
			}
			case 'setup': {
				if (!user.paymentMethod)
					throw new HttpError(
						ErrorCode.Forbidden,
						"You haven't purchased GPT 4 yet."
					)

				const referer = request.headers.get('referer')

				const previousUrl = referer
					? new URL(referer)
					: new URL('/profile', url.origin)

				const successUrl = new URL(previousUrl)
				successUrl.searchParams.set('updated-payment-method', 'true')

				const cancelUrl = new URL(previousUrl)
				cancelUrl.searchParams.set('updated-payment-method', 'false')

				const { url: checkoutUrl } = await stripe.checkout.sessions.create({
					customer: user.customerId,
					mode: 'setup',
					payment_method_types: ['card', 'link'],
					success_url: successUrl.href,
					cancel_url: cancelUrl.href
				})

				if (!checkoutUrl)
					throw new HttpError(
						ErrorCode.Internal,
						'Missing checkout session URL'
					)

				return new NextResponse(checkoutUrl)
			}
		}
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
