import { NextRequest, NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'
import userFromRequest from '@/lib/user/fromRequest'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import isChatOwnedByUser from '@/lib/chat/isOwnedByUser'
import createConversation, {
	CreateConversationData
} from '@/lib/conversation/create'
import { conversationsIndex } from '@/lib/algolia/server'
import conversationFromId from '@/lib/conversation/fromId'

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

		const { id, slug } = await createConversation(user, data)
		const conversation = await conversationFromId(id, user)

		if (!conversation)
			throw new HttpError(ErrorCode.Internal, 'Conversation not found')

		await conversationsIndex.saveObject({
			objectID: conversation.id,
			...conversation
		})

		return NextResponse.json({ id, slug })
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
