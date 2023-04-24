import { NextRequest, NextResponse } from 'next/server'

const middleware = (request: NextRequest) => {
	const headers = new Headers(request.headers)

	headers.set('x-url', request.url)

	return NextResponse.next({
		request: { headers }
	})
}

export default middleware
