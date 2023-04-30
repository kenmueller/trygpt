import stripe from '@/lib/stripe'

const ProfilePagePaymentMethod = async ({
	paymentMethodId
}: {
	paymentMethodId: string
}) => {
	const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)

	const brand = paymentMethod.card?.brand
	const last4 = paymentMethod.card?.last4

	return (
		<code>
			<strong>{brand ?? 'unknown'}</strong>{' '}
			{brand === 'amex' ? '**** ****** *' : '**** **** **** '}
			<strong>{last4 ?? '????'}</strong>
		</code>
	)
}

export default ProfilePagePaymentMethod
