import { cache } from 'react'
import { cookies } from 'next/headers'

import userFromToken from './fromToken'
import decodeCookie from '@/lib/cookie/decode'

const userFromRequest = cache(async () => {
	try {
		const encodedToken = cookies().get('token')?.value
		const token = encodedToken ? decodeCookie(encodedToken) : null

		return token ? await userFromToken(token) : null
	} catch {
		return null
	}
})

export default userFromRequest
