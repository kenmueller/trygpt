import { NextRequest, NextResponse } from 'next/server'
import DEV from './lib/dev'

const middleware = (request: NextRequest) => {
	const headers = new Headers(request.headers)
	const url = new URL(request.url)

	console.log(url.href, Object.fromEntries(headers.entries()))

	headers.set(
		'x-url',
		new URL(url.pathname, DEV ? url.origin : 'https://trygpt.co').href
	)

	return NextResponse.next({
		request: { headers }
	})
}

export default middleware
