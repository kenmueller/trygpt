import { NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'
import userFromRequest from '@/lib/user/fromRequest'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import createChat from '@/lib/chat/create'

export const dynamic = 'force-dynamic'

export const POST = async () => {
	try {
		const user = await userFromRequest()
		if (!user) throw new HttpError(ErrorCode.Unauthorized, 'Unauthorized')

		if (!user.purchasedTokens)
			throw new HttpError(ErrorCode.Forbidden, 'You have no tokens')

		const id = await createChat(user)

		return new NextResponse(id)
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
