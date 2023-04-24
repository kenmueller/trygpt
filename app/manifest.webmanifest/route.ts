import { NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'

export const dynamic = 'force-dynamic'

export const GET = async () => {
	try {
		return NextResponse.json(
			{
				background_color: 'black',
				description: 'TryGPT',
				display: 'standalone',
				lang: 'en',
				name: 'TryGPT',
				short_name: 'TryGPT',
				start_url: '/',
				orientation: 'portrait'
			},
			{
				headers: {
					'cache-control': 'no-store',
					'content-type': 'application/json'
				}
			}
		)
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
