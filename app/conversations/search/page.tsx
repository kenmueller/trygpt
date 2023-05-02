import pageMetadata from '@/lib/metadata/page'

export const generateMetadata = ({
	searchParams: { q: encodedQuery }
}: {
	searchParams: { q?: string }
}) => {
	const query = decodeURIComponent(encodedQuery ?? '')

	return pageMetadata({
		title: `${query} | Conversations | TryGPT`,
		description: `Search for ${query} on TryGPT Conversations`,
		previewTitle: query
	})
}

const SearchConversationsPage = async () => {
	return null
}

export default SearchConversationsPage
