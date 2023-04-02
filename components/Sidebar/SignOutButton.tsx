'use client'

import { useCallback, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOut } from '@fortawesome/free-solid-svg-icons'

import alertError from '@/lib/error/alert'
import signOut from '@/lib/user/signOut'

import styles from './SignOutButton.module.scss'

const SidebarSignOutButton = () => {
	const [isLoading, setIsLoading] = useState(false)

	const onClick = useCallback(async () => {
		try {
			setIsLoading(true)
			await signOut()
			// No need to set isLoading to false because the page will be refreshed
		} catch (unknownError) {
			setIsLoading(false)
			alertError(unknownError)
		}
	}, [])

	return (
		<button className={styles.root} disabled={isLoading} onClick={onClick}>
			<FontAwesomeIcon className={styles.icon} icon={faSignOut} />
			{isLoading ? 'Loading...' : 'Sign out'}
		</button>
	)
}

export default SidebarSignOutButton
