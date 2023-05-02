import 'client-only'

if (!process.env.NEXT_PUBLIC_ALGOLIA_APP_ID)
	throw new Error('Missing NEXT_PUBLIC_ALGOLIA_APP_ID')
if (!process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY)
	throw new Error('Missing NEXT_PUBLIC_ALGOLIA_SEARCH_KEY')

import createAlgolia from 'algoliasearch'

const algolia = createAlgolia(
	process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
	process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
)

export const conversationsIndex = algolia.initIndex('conversations')

export default algolia
