import { NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'
import getUrl from '@/lib/getUrl'

export const dynamic = 'force-dynamic'

export const GET = async () => {
	try {
		const url = getUrl()

		return new NextResponse(
			`User-agent: *
Sitemap: ${url.origin}/sitemap.xml`,
			{
				headers: {
					'cache-control': 'no-store',
					'content-type': 'text/plain'
				}
			}
		)
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
