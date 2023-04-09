import { headers } from 'next/headers'

import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'

const verifyAuthorization = (token: string) => {
	const header = headers().get('authorization')

	if (!header)
		throw new HttpError(ErrorCode.BadRequest, 'Missing authorization header')

	const [type, _token] = header.trim().split(/\s+/)

	if (type !== 'Bearer')
		throw new HttpError(ErrorCode.BadRequest, 'Invalid authorization type')

	if (_token !== token)
		throw new HttpError(ErrorCode.Unauthorized, 'Invalid authorization token')
}

export default verifyAuthorization
