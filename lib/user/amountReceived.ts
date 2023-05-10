/** Subtracts Stripe's fee. */
const amountReceived = (amountCharged: number) =>
	Math.max(0, Math.floor(amountCharged - (amountCharged * (2.9 / 100) + 30)))

export default amountReceived
