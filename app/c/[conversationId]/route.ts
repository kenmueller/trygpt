import { NextRequest, NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'
import conversationFromIdWithoutPointData from '@/lib/conversation/fromIdWithoutPointData'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import ORIGIN from '@/lib/origin'

export const dynamic = 'force-dynamic'

export const GET = async (
	_request: NextRequest,
	{
		params: { conversationId: encodedConversationId }
	}: {
		params: { conversationId: string }
	}
) => {
	try {
		const conversationId = decodeURIComponent(encodedConversationId)

		const conversation = await conversationFromIdWithoutPointData(
			conversationId
		)

		if (!conversation)
			throw new HttpError(ErrorCode.NotFound, 'Conversation not found')

		return NextResponse.redirect(
			new URL(
				`/conversations/${encodeURIComponent(
					conversation.id
				)}/${encodeURIComponent(conversation.slug)}`,
				ORIGIN
			)
		)
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
