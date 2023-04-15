if (!process.env.STRIPE_WEBHOOK_SECRET)
	throw new Error('Missing STRIPE_WEBHOOK_SECRET')

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

import errorFromUnknown from '@/lib/error/fromUnknown'
import stripe from '@/lib/stripe'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import userFromStripeEvent from '@/lib/user/fromStripeEvent'
import updateUser, { updateUserSubscription } from '@/lib/user/update'
import { SubscriptionStatus } from '@/lib/user'

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

		console.log(event.type);

		switch (event.type) {
			case 'payment_intent.payment_failed':
				{
					const user = await userFromStripeEvent(event)
					await updateUserSubscription(user.id, user.subscriptionId, SubscriptionStatus.INVALID);
				}
				break;

			case 'invoice.payment_succeeded':
				{
					const user = await userFromStripeEvent(event);
					await updateUserSubscription(user.id, user.subscriptionId, SubscriptionStatus.VALID);
				}
				break;
			case 'payment_intent.succeeded':
				const user = await userFromStripeEvent(event)

				const amountCharged = (event.data.object as Stripe.PaymentIntent)
					.amount_received

				const amountReceived = Math.floor(
					amountCharged - (amountCharged * (2.9 / 100) + 30)
				)

				await updateUser(user.id, {
					purchasedTokens: 15000
				})

				const subscription = await stripe.subscriptions.create({ 
						customer: user.customerId,
						items: [{
							price: process.env.STRIPE_TOKENS_PRICE_ID!
						}]
				});

				const lineItems = subscription.items.data;
				if(lineItems.length > 0){
					await updateUserSubscription(user.id, lineItems[0].id, SubscriptionStatus.VALID);
				}

				break
		}

		return new NextResponse('')
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		console.log(message);
		return new NextResponse(message, { status: code })
	}
}
