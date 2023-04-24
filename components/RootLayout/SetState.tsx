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
import useOnMount from '@/lib/useOnMount'
import userState from '@/lib/atoms/user'

const REFRESH_INTERVAL = 10 * 60 * 1000

const auth = getAuth(app)

const SetRootLayoutState = ({ user }: { user: User | null }) => {
	const router = useRouter()
	const setUser = useSetRecoilState(userState)

	useOnMount(() => {
		setUser(user)
	})

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
	}, [user, router])

	useEffect(() => {
		const interval = setInterval(() => {
			const { currentUser } = auth

			if (currentUser)
				sendToken(currentUser).catch(unknownError => {
					alertError(errorFromUnknown(unknownError))
				})
		}, REFRESH_INTERVAL)

		return () => {
			clearInterval(interval)
		}
	}, [])

	return null
}

export default SetRootLayoutState
