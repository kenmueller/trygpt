if (!process.env.NEXT_PUBLIC_DISQUS_HOST)
	throw new Error('Missing NEXT_PUBLIC_DISQUS_HOST')
if (!process.env.NEXT_PUBLIC_DISQUS_SHORTNAME)
	throw new Error('Missing NEXT_PUBLIC_DISQUS_SHORTNAME')
if (!process.env.DISQUS_API_KEY) throw new Error('Missing DISQUS_API_KEY')

import { NextRequest, NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'
import updateConversation from '@/lib/conversation/update'
import conversationFromId from '@/lib/conversation/fromId'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import errorFromResponse from '@/lib/error/fromResponse'
import userFromRequest from '@/lib/user/fromRequest'

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

		const user = await userFromRequest()

		const conversation = await conversationFromId(conversationId, user)
		if (!conversation)
			throw new HttpError(ErrorCode.NotFound, 'Conversation not found')

		const url = `https://${process.env
			.NEXT_PUBLIC_DISQUS_HOST!}/conversations/${encodeURIComponent(
			conversation.id
		)}/${encodeURIComponent(conversation.slug)}`

		const response = await fetch(
			`https://disqus.com/api/3.0/threads/set.json?thread:link=${encodeURIComponent(
				url
			)}&forum=${encodeURIComponent(
				process.env.NEXT_PUBLIC_DISQUS_SHORTNAME!
			)}&api_key=${encodeURIComponent(process.env.DISQUS_API_KEY!)}`,
			{ cache: 'no-store' }
		)

		if (!response.ok) throw await errorFromResponse(response)

		const data: {
			code: 0
			response: { posts: number }[]
		} = await response.json()

		if (data.code !== 0)
			throw new HttpError(ErrorCode.Internal, 'Disqus code not 0')

		console.log(data.response[0]?.posts ?? 0)

		await updateConversation(conversationId, {
			comments: data.response[0]?.posts ?? 0
		})

		return new NextResponse('')
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
