import 'server-only'

if (!process.env.ALGOLIA_APP_ID) throw new Error('Missing ALGOLIA_APP_ID')
if (!process.env.ALGOLIA_ADMIN_KEY) throw new Error('Missing ALGOLIA_ADMIN_KEY')

import createAlgolia from 'algoliasearch'

import DEV from './dev'

const algolia = createAlgolia(
	process.env.ALGOLIA_APP_ID,
	process.env.ALGOLIA_ADMIN_KEY
)

export const conversationsIndex = algolia.initIndex(
	DEV ? 'conversations_dev' : 'conversations'
)

export default algolia
