'use client'

import { useCallback, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'

import signIn from '@/lib/user/signIn'
import alertError from '@/lib/error/alert'

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

			// No need to set isLoading to false if the sign in was successful because the page will be refreshed
			if (!(await signIn())) setIsLoading(false)
		} catch (unknownError) {
			setIsLoading(false)
			alertError(unknownError)
		}
	}, [setIsLoading])

	return (
		<button className={className} disabled={isLoading} onClick={onClick}>
			<FontAwesomeIcon className={iconClassName} icon={faGoogle} />
			{isLoading ? 'Loading...' : 'Sign in'}
		</button>
	)
}

export default SignInButton
