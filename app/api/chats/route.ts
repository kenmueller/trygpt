import { NextRequest, NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'
import userFromRequest from '@/lib/user/fromRequest'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import createChat, { CreateChatData } from '@/lib/chat/create'

export const dynamic = 'force-dynamic'

export const POST = async (request: NextRequest) => {
	try {
		if (request.headers.get('content-type') !== 'application/json')
			throw new HttpError(ErrorCode.BadRequest, 'Invalid content type')

		const user = await userFromRequest()
		if (!user) throw new HttpError(ErrorCode.Unauthorized, 'Unauthorized')

		if (!user.purchasedAmount)
			throw new HttpError(ErrorCode.Forbidden, 'You have no tokens')

		const data: CreateChatData = await request.json()

		if (
			!(
				typeof data === 'object' &&
				data &&
				((typeof data.original === 'string' && data.original) ||
					data.original === null) &&
				((typeof data.name === 'string' && data.name) || data.name === null)
			)
		)
			throw new HttpError(ErrorCode.BadRequest, 'Invalid data')

		const id = await createChat(user, data)

		return new NextResponse(id)
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
