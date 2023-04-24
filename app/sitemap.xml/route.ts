import { NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'
import getUrl from '@/lib/getUrl'

const getPaths = async () => ['']

export const dynamic = 'force-dynamic'

export const GET = async () => {
	try {
		const url = getUrl()

		return new NextResponse(
			`<?xml version="1.0" encoding="UTF-8" ?>\
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" \
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 \
http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\
${(await getPaths())
	.map(path => `<url><loc>${url.origin}${path}</loc></url>`)
	.join('')}\
</urlset>`,
			{
				headers: {
					'cache-control': 'no-store',
					'content-type': 'application/xml'
				}
			}
		)
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
