'use client'

import { useCallback, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { logEvent } from 'firebase/analytics'

import signIn from '@/lib/user/signIn'
import alertError from '@/lib/error/alert'
import errorFromUnknown from '@/lib/error/fromUnknown'
import ThreeDotsLoader from './ThreeDotsLoader'
import analytics from '@/lib/analytics'

const SignInButton = ({
	className,
	iconClassName
}: {
	className?: string
	iconClassName?: string
}) => {
	const [isLoading, setIsLoading] = useState(false)

	const onClick = useCallback(async () => {
		try {
			setIsLoading(true)

			logEvent(analytics, 'click_sign_in')

			if (await signIn()) {
				// No need to set isLoading to false if the sign in was successful because the page will be refreshed
				logEvent(analytics, 'sign_in_successful')
			} else {
				logEvent(analytics, 'sign_in_canceled')
				setIsLoading(false)
			}
		} catch (unknownError) {
			setIsLoading(false)
			alertError(errorFromUnknown(unknownError))
		}
	}, [setIsLoading])

	return (
		<button className={className} disabled={isLoading} onClick={onClick}>
			<FontAwesomeIcon className={iconClassName} icon={faGoogle} />
			{isLoading ? <ThreeDotsLoader className="ml-1" /> : 'Sign in'}
		</button>
	)
}

export default SignInButton
