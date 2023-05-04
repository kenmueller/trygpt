import { NextRequest, NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'
import updateConversation from '@/lib/conversation/update'

export const dynamic = 'force-dynamic'

export const POST = async (
	_request: NextRequest,
	{
		params: { conversationId: encodedConversationId }
	}: {
		params: { conversationId: string }
	}
) => {
	try {
		const conversationId = decodeURIComponent(encodedConversationId)

		await updateConversation(conversationId, {
			incrementViews: 1
		})

		return new NextResponse('')
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
