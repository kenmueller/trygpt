'use client'

import { useCallback, useState } from 'react'

import signIn from '@/lib/user/signIn'

const SignInButton = () => {
	const [isLoading, setIsLoading] = useState(false)

	const onClick = useCallback(async () => {
		console.log(await signIn())
	}, [])

	return <button onClick={onClick}>Sign in with Google</button>
}

export default SignInButton
