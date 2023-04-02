'use client'

import { useCallback, useState } from 'react'

import signIn from '@/lib/user/signIn'
import alertError from '@/lib/error/alert'

const SignInButton = () => {
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
		<button disabled={isLoading} onClick={onClick}>
			{isLoading ? 'Loading...' : 'Sign in with Google'}
		</button>
	)
}

export default SignInButton
