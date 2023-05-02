import { NextRequest, NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'
import userFromRequest from '@/lib/user/fromRequest'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import isChatOwnedByUser from '@/lib/chat/isOwnedByUser'
import createConversation, {
	CreateConversationData
} from '@/lib/conversation/create'

export const dynamic = 'force-dynamic'

export const POST = async (request: NextRequest) => {
	try {
		if (request.headers.get('content-type') !== 'application/json')
			throw new HttpError(ErrorCode.BadRequest, 'Invalid content type')

		const user = await userFromRequest()
		if (!user) throw new HttpError(ErrorCode.Unauthorized, 'Unauthorized')

		const data: CreateConversationData = await request.json()

		if (
			!(
				typeof data === 'object' &&
				data &&
				typeof data.chatId === 'string' &&
				data.chatId &&
				typeof data.title === 'string' &&
				data.title &&
				typeof data.text === 'string'
			)
		)
			throw new HttpError(ErrorCode.BadRequest, 'Invalid data')

		if (!(await isChatOwnedByUser(data.chatId, user.id)))
			throw new HttpError(
				ErrorCode.Forbidden,
				'Either this chat does not exist or you do not own it'
			)

		return NextResponse.json(await createConversation(user, data))
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
