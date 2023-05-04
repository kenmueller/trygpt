import { Suspense } from 'react'
import { redirect } from 'next/navigation'

import ConversationFilter, {
	CONVERSATION_FILTERS
} from '@/lib/conversation/filter'
import conversationsFromFilter from '@/lib/conversation/fromFilter'
import pageMetadata from '@/lib/metadata/page'
import SetConversationsPageState from '@/components/ConversationsPage/SetState'
import Await from '@/components/Await'
import ThreeDotsLoader from '@/components/ThreeDotsLoader'
import FilterSelect from '@/components/ConversationsPage/FilterSelect'
import Conversations from '@/components/ConversationsPage/Conversations'

export const generateMetadata = () =>
	pageMetadata({
		title: 'Conversations | TryGPT',
		description: 'TryGPT Conversations',
		previewTitle: 'Conversations'
	})

const ConversationsPage = ({
	searchParams: { filter: encodedFilter }
}: {
	searchParams: { filter?: string }
}) => {
	const rawFilter = encodedFilter && decodeURIComponent(encodedFilter)

	if (
		!(
			rawFilter === undefined ||
			CONVERSATION_FILTERS.includes(rawFilter as ConversationFilter)
		)
	)
		redirect('/conversations')

	const filter = (rawFilter as ConversationFilter | undefined) ?? 'top-week'

	const conversations = conversationsFromFilter(filter)

	return (
		<main className="overflow-y-auto scroll-smooth">
			<SetConversationsPageState conversations={conversations} />
			<FilterSelect filter={filter} />
			<Suspense fallback={<ThreeDotsLoader />}>
				{/* @ts-expect-error */}
				<Await promise={conversations}>
					<Conversations />
				</Await>
			</Suspense>
		</main>
	)
}

export default ConversationsPage
