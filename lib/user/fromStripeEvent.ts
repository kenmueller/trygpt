import { cache } from 'react'
import Stripe from 'stripe'

import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import userFromCustomerId from './fromCustomerId'

const userFromStripeEvent = cache(async (event: Stripe.Event) => {
	const { customer: customerId } = event.data.object as {
		customer: string | null
	}

	if (!customerId)
		throw new HttpError(ErrorCode.BadRequest, 'Missing customer ID')

	const user = await userFromCustomerId(customerId)

	if (!user) throw new HttpError(ErrorCode.BadRequest, 'User not found')

	return user
})

export default userFromStripeEvent
