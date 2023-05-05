import { NextRequest, NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'
import updateConversation from '@/lib/conversation/update'
import userFromRequest from '@/lib/user/fromRequest'
import conversationFromId from '@/lib/conversation/fromId'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import updateUser from '@/lib/user/update'
import updateConversationPoint from '@/lib/conversation/updatePoint'

export const dynamic = 'force-dynamic'

export const POST = async (
	request: NextRequest,
	{
		params: { conversationId: encodedConversationId }
	}: {
		params: { conversationId: string }
	}
) => {
	try {
		const conversationId = decodeURIComponent(encodedConversationId)

		if (request.headers.get('content-type') !== 'application/json')
			throw new HttpError(ErrorCode.BadRequest, 'Invalid content type')

		const user = await userFromRequest()
		if (!user) throw new HttpError(ErrorCode.Unauthorized, 'Unauthorized')

		const conversation = await conversationFromId(conversationId, user)
		if (!conversation)
			throw new HttpError(ErrorCode.NotFound, 'Conversation not found')

		if (user.id === conversation.userId)
			throw new HttpError(
				ErrorCode.Forbidden,
				'You cannot upvote or downvote your own conversation'
			)

		const upvote: boolean | null = await request.json()

		if (!(typeof upvote === 'boolean' || upvote === null))
			throw new HttpError(ErrorCode.BadRequest, 'Invalid data')

		if (upvote === conversation.upvoted)
			throw new HttpError(ErrorCode.BadRequest, 'Invalid action')

		const incrementUpvotes =
			upvote === true
				? conversation.upvoted === true
					? 0
					: 1
				: conversation.upvoted === true
				? -1
				: 0

		const incrementDownvotes =
			upvote === false
				? conversation.upvoted === false
					? 0
					: 1
				: conversation.upvoted === false
				? -1
				: 0

		const incrementPoints = incrementUpvotes - incrementDownvotes

		await Promise.all([
			updateConversation(conversation.id, {
				incrementUpvotes,
				incrementDownvotes,
				incrementPoints
			}),
			updateUser(conversation.userId, {
				incrementPoints
			}),
			updateConversationPoint(conversation.id, user.id, {
				upvoted: conversation.upvoted,
				upvote
			})
		])

		return new NextResponse('')
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
