import User from '.'
import {
	COST_PER_1000_REQUEST_TOKENS,
	COST_PER_1000_RESPONSE_TOKENS
} from '@/lib/costPerToken'

const costThisPeriod = (user: User) => {
	const totalCost =
		(user.requestTokens / 1000) * COST_PER_1000_REQUEST_TOKENS +
		(user.responseTokens / 1000) * COST_PER_1000_RESPONSE_TOKENS

	const costThisPeriod = Math.ceil(totalCost - user.purchasedAmount)
	if (costThisPeriod <= 0) return 0

	// Stripe takes 2.9% + 30 cents per transaction. Minimum charge is 50 cents.
	const withStripeFee = Math.max(
		50,
		Math.ceil((1000 * (costThisPeriod + 30)) / 971)
	)

	return withStripeFee
}

export default costThisPeriod
