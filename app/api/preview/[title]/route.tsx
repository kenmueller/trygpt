import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from '@vercel/og'

import errorFromUnknown from '@/lib/error/fromUnknown'
import Preview from '@/components/Preview'

export const GET = async (
	_request: NextRequest,
	{
		params: { title: encodedTitle }
	}: {
		params: { title: string }
	}
) => {
	try {
		const title = decodeURIComponent(encodedTitle)
		return new ImageResponse(<Preview title={title} />)
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
