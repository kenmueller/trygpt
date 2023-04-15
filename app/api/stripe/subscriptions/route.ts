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

	
		const {url} = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: [
				{
					price: user.subscriptionId
				}
			],
			success_url: `${process.env.NEXT_PUBLIC_ORIGIN!}/chats/new`, // Replace with your success URL
			cancel_url: `${process.env.NEXT_PUBLIC_ORIGIN!}/chats/new`, // Replace with your cancel URL
		  });

		return new NextResponse(url)
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
