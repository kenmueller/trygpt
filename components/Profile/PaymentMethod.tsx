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

	return paymentMethod ? (
		<code>
			{paymentMethod.type === 'card' ? (
				<>
					<strong>{paymentMethod.card?.brand ?? 'unknown'}</strong>{' '}
					{paymentMethod.card?.brand === 'amex'
						? '**** ****** *'
						: '**** **** **** '}
					<strong>{paymentMethod.card?.last4 ?? '????'}</strong>
				</>
			) : paymentMethod.type === 'link' ? (
				<>
					<strong>link</strong>{' '}
					<strong>{paymentMethod.link?.email ?? 'unknown'}</strong>
				</>
			) : (
				<>
					<strong>{paymentMethod.type}</strong>
				</>
			)}
		</code>
	) : (
		<span className="font-bold text-red-500">error</span>
	)
}

export default ProfilePagePaymentMethod
