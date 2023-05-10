import { MetadataRoute } from 'next'

import ORIGIN from '@/lib/origin'
import allConversations from '@/lib/conversation/all'
import allUsers from '@/lib/user/all'

export const dynamic = 'force-dynamic'

const deployDate = new Date()

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
	const [users, conversations] = await Promise.all([
		allUsers(),
		allConversations()
	])

	return [
		{
			url: ORIGIN.href,
			lastModified: deployDate
		},
		{
			url: new URL('/leaderboard', ORIGIN).href,
			lastModified: deployDate
		},
		...users.map(({ id, updated }) => ({
			url: new URL(`/users/${encodeURIComponent(id)}`, ORIGIN).href,
			lastModified: new Date(updated)
		})),
		{
			url: new URL('/conversations', ORIGIN).href,
			lastModified: deployDate
		},
		{
			url: new URL('/conversations/new', ORIGIN).href,
			lastModified: deployDate
		},
		...conversations.map(({ id, slug, updated }) => ({
			url: new URL(
				`/conversations/${encodeURIComponent(id)}/${encodeURIComponent(slug)}`,
				ORIGIN
			).href,
			lastModified: new Date(updated)
		}))
	]
}

export default sitemap
