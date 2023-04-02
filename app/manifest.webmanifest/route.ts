import { NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'

import theme from '@/styles/theme.module.scss'

export const revalidate = 0
export const dynamic = 'force-dynamic'

export const GET = async () => {
	try {
		return NextResponse.json(
			{
				background_color: theme.dark,
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
