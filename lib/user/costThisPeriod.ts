import User from '.'
import {
	COST_PER_1000_PROMPT_TOKENS,
	COST_PER_1000_COMPLETION_TOKENS
} from '@/lib/costPerToken'

/** Can be less than 0 and does not include Stripe fee. */
export const baseCostThisPeriod = (user: User) => {
	const totalCost =
		(user.requestTokens / 1000) * COST_PER_1000_PROMPT_TOKENS +
		(user.responseTokens / 1000) * COST_PER_1000_COMPLETION_TOKENS

	return Math.ceil(totalCost - user.purchasedAmount)
}

const costThisPeriod = (user: User) => {
	const costThisPeriod = baseCostThisPeriod(user)
	if (costThisPeriod <= 0) return 0

	// Stripe takes 2.9% + 30 cents per transaction. Minimum charge is 50 cents.
	const withStripeFee = Math.max(
		50,
		Math.ceil((1000 * (costThisPeriod + 30)) / 971)
	)

	return withStripeFee
}

export default costThisPeriod
