import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from 'firebase-admin/auth'

import admin from '@/lib/firebase/admin'
import HttpError from '@/lib/error/http'
import errorFromUnknown from '@/lib/error/fromUnknown'
import setCookie from '@/lib/cookie/set'
import ErrorCode from '@/lib/error/code'
import UserTokenData from '@/lib/user/tokenData'
import createUserFromTokenData from '@/lib/user/createFromTokenData'
import userExistsWithId from '@/lib/user/existsWithId'

export const dynamic = 'force-dynamic'

const auth = getAuth(admin)

export const POST = async (request: NextRequest) => {
	try {
		if (request.headers.get('content-type') !== 'application/json')
			throw new HttpError(ErrorCode.BadRequest, 'Invalid content type')

		const data: { token: string; user: UserTokenData } | null =
			await request.json()

		if (
			!(
				(typeof data === 'object' &&
					data &&
					typeof data.token === 'string' &&
					typeof data.user === 'object' &&
					data.user) ||
				data === null
			)
		)
			throw new HttpError(ErrorCode.BadRequest, 'Invalid data')

		if (data) {
			try {
				await auth.verifyIdToken(data.token)
			} catch {
				throw new HttpError(ErrorCode.Forbidden, 'Invalid token')
			}

			if (!(await userExistsWithId(data.user.id)))
				await createUserFromTokenData(data.user)
		}

		return new NextResponse('', {
			headers: {
				'set-cookie': setCookie('token', data?.token ?? null)
			}
		})
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
