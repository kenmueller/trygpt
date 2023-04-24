'use client'

import { useCallback, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOut } from '@fortawesome/free-solid-svg-icons'

import alertError from '@/lib/error/alert'
import signOut from '@/lib/user/signOut'
import errorFromUnknown from '@/lib/error/fromUnknown'
import ThreeDotsLoader from '@/components/ThreeDotsLoader'

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
	}, [setIsLoading])

	return (
		<button
			className="flex items-center gap-4 h-10 px-4 font-bold transition-colors ease-linear hover:bg-white hover:bg-opacity-10"
			disabled={isLoading}
			onClick={onClick}
		>
			<FontAwesomeIcon className="w-[30px] text-xl" icon={faSignOut} />
			{isLoading ? <ThreeDotsLoader /> : 'Sign out'}
		</button>
	)
}

export default SidebarSignOutButton
