'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

import app from '@/lib/firebase'
import User from '@/lib/user'
import sendToken from '@/lib/user/sendToken'
import alertError from '@/lib/error/alert'

const auth = getAuth(app)

const UpdateUser = ({ user }: { user: User | null }) => {
	const router = useRouter()

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
					alertError(unknownError)
				}
			},
			alertError
		)
	}, [user, router])

	useEffect(() => {
		const interval = setInterval(() => {
			const { currentUser } = auth
			if (currentUser) sendToken(currentUser).catch(alertError)
		})

		return () => {
			clearInterval(interval)
		}
	}, [])

	return null
}

export default UpdateUser
