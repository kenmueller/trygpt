import { NextRequest, NextResponse } from 'next/server'

import userFromRequest from '@/lib/user/fromRequest'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import conversationFromIdWithoutPointData from '@/lib/conversation/fromIdWithoutPointData'
import updateConversation from '@/lib/conversation/update'
import errorFromUnknown from '@/lib/error/fromUnknown'
import { conversationsIndex } from '@/lib/algolia'

export const dynamic = 'force-dynamic'

export const DELETE = async (
	_request: NextRequest,
	{
		params: { conversationId: encodedConversationId }
	}: {
		params: { conversationId: string }
	}
) => {
	try {
		const conversationId = decodeURIComponent(encodedConversationId)

		const user = await userFromRequest()
		if (!user) throw new HttpError(ErrorCode.Unauthorized, 'Unauthorized')

		const conversation = await conversationFromIdWithoutPointData(
			conversationId
		)

		if (!conversation)
			throw new HttpError(ErrorCode.NotFound, 'Conversation not found')

		if (conversation.userId !== user.id)
			throw new HttpError(
				ErrorCode.Forbidden,
				'You do not own this conversation'
			)

		await updateConversation(conversation.id, {
			visible: false,
			updated: 'now'
		})

		await conversationsIndex.deleteObject(conversation.id)

		return new NextResponse('')
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
