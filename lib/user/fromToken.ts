import 'server-only'

import { cache } from 'react'
import { FirebaseError } from 'firebase-admin'
import { getAuth } from 'firebase-admin/auth'
import { DatabasePoolConnection } from 'slonik'

import admin from '@/lib/firebase/admin'
import userFromId from './fromId'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'

const auth = getAuth(admin)

const userFromToken = cache(
	async (token: string, connection?: DatabasePoolConnection) => {
		try {
			const { uid } = await auth.verifyIdToken(token)

			const user = await userFromId(uid, connection)
			if (!user) throw new HttpError(ErrorCode.Internal, 'User not found')

			return user
		} catch (unknownError) {
			switch ((unknownError as FirebaseError)?.code) {
				case 'auth/id-token-expired':
					return null
				default:
					throw unknownError
			}
		}
	}
)

export default userFromToken
