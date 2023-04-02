import 'server-only'

import { cache } from 'react'
import { cookies } from 'next/headers'

import userFromToken from './fromToken'
import decodeCookie from '@/lib/cookie/decode'

const _userFromRequest = async () => {
	const encodedToken = cookies().get('token')?.value
	const token = encodedToken ? decodeCookie(encodedToken) : null

	return token ? await userFromToken(token) : null
}

const userFromRequest = cache(_userFromRequest)

export default userFromRequest
