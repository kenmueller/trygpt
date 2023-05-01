if (!process.env.STRIPE_WEBHOOK_SECRET)
	throw new Error('Missing STRIPE_WEBHOOK_SECRET')

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

import errorFromUnknown from '@/lib/error/fromUnknown'
import stripe from '@/lib/stripe'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import userFromStripeEvent from '@/lib/user/fromStripeEvent'
import updateUser from '@/lib/user/update'

export const dynamic = 'force-dynamic'

const getPaymentMethod = async ({
	paymentIntentId,
	setupIntentId
}: {
	paymentIntentId: unknown
	setupIntentId: unknown
}) => {
	if (typeof paymentIntentId === 'string') {
		const { payment_method: paymentMethod } =
			await stripe.paymentIntents.retrieve(paymentIntentId)

		if (typeof paymentMethod !== 'string')
			throw new HttpError(
				ErrorCode.BadRequest,
				'Missing payment method from payment intent'
			)

		return paymentMethod
	} else if (typeof setupIntentId === 'string') {
		const { payment_method: paymentMethod } =
			await stripe.setupIntents.retrieve(setupIntentId)

		if (typeof paymentMethod !== 'string')
			throw new HttpError(
				ErrorCode.BadRequest,
				'Missing payment method from setup intent'
			)

		return paymentMethod
	} else {
		throw new HttpError(
			ErrorCode.BadRequest,
			'Missing payment intent and setup intent'
		)
	}
}

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

		switch (event.type) {
			case 'checkout.session.completed': {
				const user = await userFromStripeEvent(event)

				const { payment_intent: paymentIntentId, setup_intent: setupIntentId } =
					event.data.object as Stripe.Checkout.Session

				const paymentMethod = await getPaymentMethod({
					paymentIntentId,
					setupIntentId
				})

				if (paymentMethod !== user.paymentMethod) {
					await updateUser(user.id, { paymentMethod })

					if (user.paymentMethod)
						// Detach old payment method
						await stripe.paymentMethods.detach(user.paymentMethod)
				}

				break
			}
			case 'payment_intent.succeeded': {
				const user = await userFromStripeEvent(event)

				const { amount_received: amountCharged } = event.data
					.object as Stripe.PaymentIntent

				const amountReceived = Math.floor(
					amountCharged - (amountCharged * (2.9 / 100) + 30)
				)

				await updateUser(user.id, {
					lastCharged: 'now',
					incrementPurchasedAmount: amountReceived
				})

				break
			}
		}

		return new NextResponse('')
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
