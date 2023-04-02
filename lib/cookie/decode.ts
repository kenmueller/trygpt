import 'server-only'

if (!process.env.COOKIE_SECRET) throw new Error('Missing COOKIE_SECRET')

import { unsign } from 'cookie-signature'

import HttpError from '@/lib/error/http'

const decodeCookie = (value: string) => {
	const decodedValue = unsign(value, process.env.COOKIE_SECRET!)
	if (!decodedValue) throw new HttpError(400, 'Invalid cookie')

	return decodedValue
}

export default decodeCookie
