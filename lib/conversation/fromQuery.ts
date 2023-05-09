import { cache } from 'react'
import omit from 'lodash/omit'

import { ConversationWithUserAndChatData } from '.'
import { conversationsIndex } from '@/lib/algolia'

const conversationsFromQuery = cache(async (query: string) => {
	const { hits } = await conversationsIndex.search(query)

	console.log(JSON.stringify(hits, null, 2))

	return hits.map(hit => ({
		...omit(hit, ['objectID', '_highlightResult']),
		id: hit.objectID
	})) as ConversationWithUserAndChatData[]
})

export default conversationsFromQuery
