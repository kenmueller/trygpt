import { NextRequest, NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'
import userFromRequest from '@/lib/user/fromRequest'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import isChatOwnedByUser from '@/lib/chat/isOwnedByUser'
import updateChat from '@/lib/chat/update'

export const dynamic = 'force-dynamic'

export const DELETE = async (
	_request: NextRequest,
	{ params: { id: encodedChatId } }: { params: { id: string } }
) => {
	try {
		const chatId = decodeURIComponent(encodedChatId)

		const user = await userFromRequest()
		if (!user) throw new HttpError(ErrorCode.Unauthorized, 'Unauthorized')

		if (!user.purchasedAmount)
			throw new HttpError(ErrorCode.Forbidden, 'You have no tokens')

		if (!(await isChatOwnedByUser(chatId, user.id)))
			throw new HttpError(ErrorCode.Forbidden, 'You do not own this chat')

		await updateChat(chatId, {
			visible: false,
			updated: 'now'
		})

		return new NextResponse('')
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
