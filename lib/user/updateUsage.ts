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
		"si_NgZkqvUyOYzXID",
		usageRecord
	)
}

const updateUsage = async (user: User, incrementTokens: number) => {

		if(user.purchasedTokens == 0){
			await updateTokenUsageRecord({
				quantity: incrementTokens,
				timestamp: Math.floor(Date.now() / 1000),
				action: 'increment',
				
			})
			await updateUser(user.id, { incrementTokens })
		}else{
			const dif = user.purchasedTokens - incrementTokens;
			if(dif >= 0){
				await updateUser(user.id, { purchasedTokens: dif })
			}else{
				const overUse = -dif;
				await updateTokenUsageRecord({
					quantity: overUse,
					timestamp: Math.floor(Date.now() / 1000),
					action: 'increment'
				})
				await updateUser(user.id, { incrementTokens: overUse, purchasedTokens: 0})
			}

		}

	
}

export default updateUsage