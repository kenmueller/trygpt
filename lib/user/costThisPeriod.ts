import User from '.'
import {
	COST_PER_1000_PROMPT_TOKENS,
	COST_PER_1000_COMPLETION_TOKENS,
	COST_PER_IMAGE
} from '@/lib/cost'

/** Can be less than 0 and does not include Stripe fee. */
export const baseCostThisPeriod = (user: User) => {
	const totalCost =
		(user.promptTokens / 1000) * COST_PER_1000_PROMPT_TOKENS +
		(user.completionTokens / 1000) * COST_PER_1000_COMPLETION_TOKENS +
		user.images * COST_PER_IMAGE

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
