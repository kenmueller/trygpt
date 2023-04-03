import { NextRequest, NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'
import userFromRequest from '@/lib/user/fromRequest'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import createChatMessage from '@/lib/chat/message/create'
import chatIsOwnedByUser from '@/lib/chat/isOwnedByUser'

export const revalidate = 0
export const dynamic = 'force-dynamic'

export const POST = async (
	request: NextRequest,
	{ params: { id } }: { params: { id: string } }
) => {
	try {
		const chatId = decodeURIComponent(id)

		const user = await userFromRequest()
		if (!user) throw new HttpError(ErrorCode.Unauthorized, 'Unauthorized')

		if (!chatIsOwnedByUser(chatId, user.id))
			throw new HttpError(ErrorCode.Forbidden, 'You do not own this chat')

		const text = (await request.text()).trim()
		if (!text) throw new HttpError(ErrorCode.BadRequest, 'No text')

		await createChatMessage({ chatId, role: 'user', text })

		return new NextResponse('')
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
