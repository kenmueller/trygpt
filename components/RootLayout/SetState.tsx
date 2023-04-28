'use client'

import { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'
import { useRouter } from 'next/navigation'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

import app from '@/lib/firebase'
import User from '@/lib/user'
import sendToken from '@/lib/user/sendToken'
import alertError from '@/lib/error/alert'
import errorFromUnknown from '@/lib/error/fromUnknown'
import useImmediateEffect from '@/lib/useImmediateEffect'
import userState from '@/lib/atoms/user'
import isMobileState from '@/lib/atoms/isMobile'

const REFRESH_INTERVAL = 10 * 60 * 1000

const auth = getAuth(app)

const sendTokenForCurrentUser = async () => {
	try {
		const { currentUser } = auth
		if (!currentUser) return

		await sendToken(currentUser)
	} catch (unknownError) {
		alertError(errorFromUnknown(unknownError))
	}
}

const SetRootLayoutState = ({
	isMobile,
	user
}: {
	isMobile: boolean
	user: User | null
}) => {
	const router = useRouter()

	const setIsMobile = useSetRecoilState(isMobileState)
	const setUser = useSetRecoilState(userState)

	useImmediateEffect(() => {
		setIsMobile(isMobile)
	}, [isMobile, setIsMobile])

	useImmediateEffect(() => {
		setUser(user)
	}, [user, setUser])

	useEffect(() => {
		onAuthStateChanged(
			auth,
			async authUser => {
				try {
					await sendToken(authUser)

					const isAuthStateMismatched = !(
						(authUser === null && user === null) ||
						(authUser && user && authUser.uid === user.id)
					)

					if (isAuthStateMismatched) router.refresh()
				} catch (unknownError) {
					alertError(errorFromUnknown(unknownError))
				}
			},
			unknownError => {
				alertError(errorFromUnknown(unknownError))
			}
		)

		// Do not include user in dependencies
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router])

	useEffect(() => {
		window.addEventListener('focus', sendTokenForCurrentUser)

		return () => {
			window.removeEventListener('focus', sendTokenForCurrentUser)
		}
	})

	useEffect(() => {
		const interval = setInterval(sendTokenForCurrentUser, REFRESH_INTERVAL)

		return () => {
			clearInterval(interval)
		}
	}, [])

	return null
}

export default SetRootLayoutState
