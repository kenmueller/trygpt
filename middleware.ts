import { NextRequest, NextResponse } from 'next/server'

import DEV from './lib/dev'
import HttpError from './lib/error/http'
import ErrorCode from './lib/error/code'
import errorFromUnknown from './lib/error/fromUnknown'
import ORIGIN from './lib/origin'

const middleware = (request: NextRequest) => {
	try {
		const headers = new Headers(request.headers)

		const protocol = headers.get('x-forwarded-proto')
		const host = headers.get('x-forwarded-host')

		if (!(protocol && host))
			throw new HttpError(ErrorCode.BadRequest, 'Invalid request')

		const originalUrl = new URL(request.url)

		const search = originalUrl.searchParams.toString()
		const path = `${originalUrl.pathname}${search && `?${search}`}`

		const url = new URL(path, ORIGIN)

		if (!((DEV ? /http/ : /https/).test(protocol) && host === ORIGIN.host))
			return NextResponse.redirect(url)

		headers.set('x-url', url.href)

		return NextResponse.next({
			request: { headers }
		})
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}

export default middleware
