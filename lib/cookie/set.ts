import 'server-only'

if (!process.env.COOKIE_SECRET) throw new Error('Missing COOKIE_SECRET')

import { CookieSerializeOptions, serialize } from 'cookie'
import { sign } from 'cookie-signature'

import DEV from '@/lib/dev'

/** The minimum `Expires`. */
const PAST = new Date(0)

/** The latest `Max-Age` in milliseconds. */
const FUTURE = 10 * 365 * 24 * 60 * 60 * 1000

const DEFAULT_OPTIONS: CookieSerializeOptions = {
	path: '/',
	secure: !DEV,
	sameSite: 'lax'
}

export interface SetCookieOptions {
	maxAge?: number
	httpOnly?: boolean
}

const setCookie = (
	name: string,
	value: string | null,
	{ maxAge = FUTURE, httpOnly = true }: SetCookieOptions = {}
) =>
	serialize(
		name,
		value ? sign(value, process.env.COOKIE_SECRET!) : '',
		value === null
			? { ...DEFAULT_OPTIONS, expires: PAST, httpOnly }
			: { ...DEFAULT_OPTIONS, maxAge, httpOnly }
	)

export default setCookie
