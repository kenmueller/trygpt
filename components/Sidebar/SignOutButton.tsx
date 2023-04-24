'use client'

import { useCallback, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOut } from '@fortawesome/free-solid-svg-icons'

import alertError from '@/lib/error/alert'
import signOut from '@/lib/user/signOut'
import errorFromUnknown from '@/lib/error/fromUnknown'

const SidebarSignOutButton = () => {
	const [isLoading, setIsLoading] = useState(false)

	const onClick = useCallback(async () => {
		try {
			setIsLoading(true)
			await signOut()
			// No need to set isLoading to false because the page will be refreshed
		} catch (unknownError) {
			setIsLoading(false)
			alertError(errorFromUnknown(unknownError))
		}
	}, [])

	return (
		<button className="" disabled={isLoading} onClick={onClick}>
			<FontAwesomeIcon className="" icon={faSignOut} />
			{isLoading ? 'Loading...' : 'Sign out'}
		</button>
	)
}

export default SidebarSignOutButton
