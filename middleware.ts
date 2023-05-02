if (!process.env.NEXT_PUBLIC_HOST) throw new Error('Missing NEXT_PUBLIC_HOST')

import { NextRequest, NextResponse } from 'next/server'

import DEV from './lib/dev'
import HttpError from './lib/error/http'
import ErrorCode from './lib/error/code'
import errorFromUnknown from './lib/error/fromUnknown'

const ORIGIN = `${DEV ? 'http' : 'https'}://${process.env.NEXT_PUBLIC_HOST}`

const middleware = (request: NextRequest) => {
	try {
		const headers = new Headers(request.headers)

		const protocol = headers.get('x-forwarded-proto')
		const host = headers.get('x-forwarded-host')

		if (!(protocol && host))
			throw new HttpError(ErrorCode.BadRequest, 'Invalid request')

		const url = new URL(request.url)

		const search = url.searchParams.toString()
		const path = `${url.pathname}${search && `?${search}`}`

		if (
			!(
				(DEV ? /http/ : /https/).test(protocol) &&
				host === process.env.NEXT_PUBLIC_HOST!
			)
		)
			return NextResponse.redirect(new URL(path, ORIGIN))

		headers.set('x-url', new URL(path, ORIGIN).href)

		return NextResponse.next({
			request: { headers }
		})
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}

export default middleware
