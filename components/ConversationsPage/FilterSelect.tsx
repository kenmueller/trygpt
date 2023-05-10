import Link from 'next/link'
import cx from 'classnames'

import ConversationFilter, {
	filterName,
	CONVERSATION_FILTERS
} from '@/lib/conversation/filter'

const ConversationsPageFilterSelect = ({
	filter
}: {
	filter: ConversationFilter
}) => (
	<div className="flex justify-center items-center gap-2 min-[680px]:gap-8 max-w-[1500px] w-[95%]">
		{CONVERSATION_FILTERS.map(otherFilter => (
			<Link
				key={otherFilter}
				className={cx(
					'text-sm min-[680px]:text-base text-center',
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
