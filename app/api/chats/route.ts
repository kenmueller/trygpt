import { NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'
import userFromRequest from '@/lib/user/fromRequest'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import createChat from '@/lib/chat/create'
import { SubscriptionStatus } from '@/lib/user'

export const dynamic = 'force-dynamic'

export const POST = async () => {
	try {
		const user = await userFromRequest()
		if (!user) throw new HttpError(ErrorCode.Unauthorized, 'Unauthorized')

		if (user.subscriptionStatus != SubscriptionStatus.VALID)
			throw new HttpError(ErrorCode.Forbidden, 'There is an issue with your subscription')

		const id = await createChat(user)

		return new NextResponse(id)
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
