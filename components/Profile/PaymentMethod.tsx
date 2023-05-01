import stripe from '@/lib/stripe'

const getPaymentMethod = async (id: string) => {
	try {
		return await stripe.paymentMethods.retrieve(id)
	} catch {
		return null
	}
}

const ProfilePagePaymentMethod = async ({
	paymentMethodId
}: {
	paymentMethodId: string
}) => {
	const paymentMethod = await getPaymentMethod(paymentMethodId)

	const brand = paymentMethod?.card?.brand
	const last4 = paymentMethod?.card?.last4

	return paymentMethod ? (
		<code>
			<strong>{brand ?? 'unknown'}</strong>{' '}
			{brand === 'amex' ? '**** ****** *' : '**** **** **** '}
			<strong>{last4 ?? '????'}</strong>
		</code>
	) : (
		<span className="font-bold text-red-500">error</span>
	)
}

export default ProfilePagePaymentMethod
