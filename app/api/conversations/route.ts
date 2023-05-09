import { NextRequest, NextResponse } from 'next/server'
import omit from 'lodash/omit'

import errorFromUnknown from '@/lib/error/fromUnknown'
import userFromRequest from '@/lib/user/fromRequest'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import createConversation, {
	CreateConversationData
} from '@/lib/conversation/create'
import { conversationsIndex } from '@/lib/algolia'
import conversationFromIdWithoutPointData from '@/lib/conversation/fromIdWithoutPointData'
import chatFromId from '@/lib/chat/fromId'
import truncate from '@/lib/truncate'

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

		const chat = await chatFromId(data.chatId)

		if (!chat) throw new HttpError(ErrorCode.NotFound, 'Chat not found')

		if (chat.userId !== user.id)
			throw new HttpError(ErrorCode.Forbidden, 'You do not own this chat')

		if (chat.conversationId)
			throw new HttpError(
				ErrorCode.Forbidden,
				'This chat has already been posted as a conversation'
			)

		data.title = truncate(data.title, 150)

		const { id, slug } = await createConversation(user, data)
		const conversation = await conversationFromIdWithoutPointData(id)

		if (!conversation)
			throw new HttpError(ErrorCode.Internal, 'Conversation not found')

		await conversationsIndex.saveObject({
			objectID: conversation.id,
			...omit(conversation, ['id'])
		})

		return NextResponse.json({ id, slug })
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
