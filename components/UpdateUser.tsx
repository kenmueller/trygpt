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
					// Server and client have the same auth state
					if (
						(authUser === null && user === null) ||
						(authUser && user && authUser.uid === user.id)
					)
						return

					await sendToken(authUser)
					router.refresh()
				} catch (unknownError) {
					alertError(unknownError)
				}
			},
			alertError
		)
	}, [user, router])

	return null
}

export default UpdateUser
