import { NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'
import maskableImage from '@/assets/maskable.png'

export const dynamic = 'force-dynamic'

export const GET = async () => {
	try {
		return NextResponse.json(
			{
				dir: 'ltr',
				lang: 'en-US',
				scope: '/',
				start_url: '/',
				name: 'TryGPT',
				short_name: 'TryGPT',
				description: 'TryGPT',
				display: 'standalone',
				theme_color: '#27272a',
				background_color: '#27272a',
				categories: ['games', 'social'],
				icons: [
					{
						src: maskableImage.src,
						sizes: '512x512',
						purpose: 'maskable any'
					}
				]
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
