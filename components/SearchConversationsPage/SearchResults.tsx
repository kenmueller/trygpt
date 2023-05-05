'use client'

import { useRecoilValue } from 'recoil'
import cx from 'classnames'

import conversationsSearchResultState from '@/lib/atoms/conversationsSearchResult'
import SearchResult from './SearchResult'

const SearchConversationsPageSearchResults = ({
	className
}: {
	className?: string
}) => {
	const searchResults = useRecoilValue(conversationsSearchResultState)

	return (
		<div
			className={cx(
				'flex flex-col items-stretch gap-4 max-w-[1500px] w-[95%]',
				className
			)}
		>
			{searchResults?.map(conversation => (
				<SearchResult key={conversation.id} conversation={conversation} />
			))}
		</div>
	)
}

export default SearchConversationsPageSearchResults
