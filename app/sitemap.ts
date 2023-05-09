import { MetadataRoute } from 'next'

import ORIGIN from '@/lib/origin'
import allConversations from '@/lib/conversation/all'

export const dynamic = 'force-dynamic'

const deployDate = new Date()

const sitemap = async (): Promise<MetadataRoute.Sitemap> => [
	{ url: ORIGIN.href, lastModified: deployDate },
	{ url: new URL('/conversations', ORIGIN).href, lastModified: deployDate },
	{ url: new URL('/conversations/new', ORIGIN).href, lastModified: deployDate },
	...(await allConversations()).map(({ id, slug, updated }) => ({
		url: new URL(
			`/conversations/${encodeURIComponent(id)}/${encodeURIComponent(slug)}`,
			ORIGIN
		).href,
		lastModified: new Date(updated)
	}))
]

export default sitemap
