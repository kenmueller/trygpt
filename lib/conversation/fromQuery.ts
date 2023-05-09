import { cache } from 'react'
import pick from 'lodash/pick'

import { ConversationWithUserAndChatData } from '.'
import { conversationsIndex } from '@/lib/algolia'

const conversationsFromQuery = cache(async (query: string) => {
	const { hits } = await conversationsIndex.search(query)

	return hits.map(hit =>
		pick(hit, [
			'userId',
			'chatId',
			'id',
			'slug',
			'title',
			'text',
			'upvotes',
			'downvotes',
			'points',
			'views',
			'comments',
			'created',
			'updated',
			'userPhoto',
			'userName',
			'userPoints',
			'chatName'
		])
	) as ConversationWithUserAndChatData[]
})

export default conversationsFromQuery
