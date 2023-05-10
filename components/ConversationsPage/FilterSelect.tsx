import Link from 'next/link'
import cx from 'classnames'

import ConversationFilter, {
	CONVERSATION_FILTERS
} from '@/lib/conversation/filter'

const filterName = (filter: ConversationFilter) => {
	switch (filter) {
		case 'new-week':
			return 'New this week'
		case 'top-day':
			return 'Top today'
		case 'top-week':
			return 'Top this week'
		case 'top-month':
			return 'Top this month'
	}
}

const ConversationsPageFilterSelect = ({
	filter
}: {
	filter: ConversationFilter
}) => (
	<div className="flex justify-center items-center gap-2 min-[550px]:gap-8 max-w-[1500px] w-[95%]">
		{CONVERSATION_FILTERS.map(otherFilter => (
			<Link
				key={otherFilter}
				className={cx(
					'text-sm min-[550px]:text-base text-center',
					filter === otherFilter && 'pointer-events-none font-bold text-sky-500'
				)}
				href={`/conversations?filter=${encodeURIComponent(otherFilter)}`}
				aria-current={filter === otherFilter ? 'page' : undefined}
			>
				{filterName(otherFilter)}
			</Link>
		))}
	</div>
)

export default ConversationsPageFilterSelect
