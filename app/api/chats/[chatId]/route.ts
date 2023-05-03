if (!process.env.NEXT_PUBLIC_PREVIEW_MESSAGE_LIMIT)
	throw new Error('Missing NEXT_PUBLIC_PREVIEW_MESSAGE_LIMIT')

import { NextRequest, NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'
import userFromRequest from '@/lib/user/fromRequest'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import isChatOwnedByUser from '@/lib/chat/isOwnedByUser'
import updateChat from '@/lib/chat/update'
import formatCents from '@/lib/cents/format'
import chatFromId from '@/lib/chat/fromId'

export const dynamic = 'force-dynamic'

export const GET = async (
	_request: NextRequest,
	{ params: { chatId: encodedChatId } }: { params: { chatId: string } }
) => {
	try {
		const chatId = decodeURIComponent(encodedChatId)

		const chat = await chatFromId(chatId)
		if (!chat) throw new HttpError(ErrorCode.NotFound, 'Chat not found')

		return NextResponse.json(chat)
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}

export const DELETE = async (
	_request: NextRequest,
	{ params: { chatId: encodedChatId } }: { params: { chatId: string } }
) => {
	try {
		const chatId = decodeURIComponent(encodedChatId)

		const user = await userFromRequest()
		if (!user) throw new HttpError(ErrorCode.Unauthorized, 'Unauthorized')

		const preview = !user.paymentMethod

		const hasPreviewMessagesRemaining =
			user.previewMessages <
			Number.parseInt(process.env.NEXT_PUBLIC_PREVIEW_MESSAGE_LIMIT!)

		if (preview && !hasPreviewMessagesRemaining)
			throw new HttpError(
				ErrorCode.Forbidden,
				`You have no free messages remaining. Purchase GPT 4 for ${formatCents(
					100
				)} to continue.`
			)

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
