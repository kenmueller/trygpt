import { Suspense } from 'react'
import { redirect } from 'next/navigation'

import conversationsFromQuery from '@/lib/conversation/fromQuery'
import pageMetadata from '@/lib/metadata/page'
import SetSearchConversationsPageState from '@/components/SearchConversationsPage/SetState'
import ThreeDotsLoader from '@/components/ThreeDotsLoader'
import Await from '@/components/Await'
import SearchResults from '@/components/SearchConversationsPage/SearchResults'

export const generateMetadata = ({
	searchParams: { q: encodedQuery }
}: {
	searchParams: { q?: string }
}) => {
	const query = encodedQuery && decodeURIComponent(encodedQuery).trim()
	if (!query) return {}

	return pageMetadata({
		title: `${query} | Conversations | TryGPT`,
		description: `Search for ${query} on TryGPT Conversations`,
		previewTitle: query
	})
}

const SearchConversationsPage = ({
	searchParams: { q: encodedQuery }
}: {
	searchParams: { q?: string }
}) => {
	const query = encodedQuery && decodeURIComponent(encodedQuery).trim()
	if (!query) redirect('/conversations')

	const searchResults = conversationsFromQuery(query)

	return (
		<main className="flex flex-col items-center gap-4 overflow-y-auto scroll-smooth">
			<SetSearchConversationsPageState searchResults={searchResults} />
			<Suspense fallback={<ThreeDotsLoader className="mt-4" />}>
				{/* @ts-expect-error */}
				<Await promise={searchResults}>
					<SearchResults className="mt-4" />
				</Await>
			</Suspense>
		</main>
	)
}

export default SearchConversationsPage
