if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
	throw new Error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')

import Script from 'next/script'
import cx from 'classnames'

import styles from './BuyButton.module.scss'

const BuyButton = ({ className, id }: { className?: string; id: string }) => (
	<>
		{/* @ts-expect-error */}
		<stripe-buy-button
			class={cx(styles.root, className)}
			buy-button-id={id}
			publishable-key={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
		/>
		<Script async src="https://js.stripe.com/v3/buy-button.js" />
	</>
)

export default BuyButton
