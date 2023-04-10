import 'server-only'

import User from '.'
import updateUser from './update'
import stripe from '../stripe'

type UpdateUsageAction = 'increment' | 'set'

interface SubscriptionItemUsageRecord {
	quantity: number
	timestamp: number
	action: UpdateUsageAction
}

async function updateTokenUsageRecord(
	usageRecord: SubscriptionItemUsageRecord
) {
	await stripe.subscriptionItems.createUsageRecord(
		process.env.STRIPE_TOKENS_PRICE_ID!,
		usageRecord
	)
}

const updateUsage = async (user: User, incrementTokens: number) => {
	await updateTokenUsageRecord({
		quantity: incrementTokens,
		timestamp: Date.now(),
		action: 'increment'
	})
	await updateUser(user.id, { incrementTokens })
}

export default updateUsage
