import { cache } from 'react'

import { ConversationWithUserAndChatData } from '.'
import { conversationsIndex } from '@/lib/algolia'

const conversationsFromQuery = cache(async (query: string) => {
	const { hits } = await conversationsIndex.search(query)
	return hits as unknown as ConversationWithUserAndChatData[]
})

export default conversationsFromQuery
