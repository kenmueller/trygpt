if (!process.env.HOST) throw new Error('Missing HOST')

import { NextRequest, NextResponse } from 'next/server'

import DEV from './lib/dev'
import HttpError from './lib/error/http'
import ErrorCode from './lib/error/code'
import errorFromUnknown from './lib/error/fromUnknown'

const ORIGIN = `https://${process.env.HOST}`

const middleware = (request: NextRequest) => {
	try {
		const headers = new Headers(request.headers)
		const url = new URL(request.url)

		const protocol = headers.get('x-forwarded-proto')
		const host = headers.get('x-forwarded-host')

		if (!(protocol && host))
			throw new HttpError(ErrorCode.BadRequest, 'Invalid request')

		if (!(DEV || (/https/.test(protocol) && host === process.env.HOST!)))
			return NextResponse.redirect(new URL(url.pathname, ORIGIN))

		headers.set('x-url', new URL(url.pathname, DEV ? url.origin : ORIGIN).href)

		return NextResponse.next({
			request: { headers }
		})
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}

export default middleware
