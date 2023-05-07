'use client'

import { ChangeEvent, FormEvent, useCallback, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

const ConversationsSearch = ({ className }: { className?: string }) => {
	const router = useRouter()
	const searchParams = useSearchParams()

	const searchQueryInitialValue = searchParams.get('q') ?? ''
	const [searchQuery, setSearchQuery] = useState(searchQueryInitialValue)

	const trimmedSearchQuery = searchQuery.trim()

	const onSearchSubmit = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault()

			router.push(
				`/conversations/search?q=${encodeURIComponent(trimmedSearchQuery)}`
			)
		},
		[router, trimmedSearchQuery]
	)

	const onSearchQueryChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setSearchQuery(event.target.value)
		},
		[setSearchQuery]
	)

	return (
		<form
			className={cx('flex items-center gap-2 relative', className)}
			onSubmit={onSearchSubmit}
		>
			<input
				className="grow-[1] w-0 min-w-full px-3 py-1.5 bg-white bg-opacity-10 rounded-lg outline-none placeholder:text-white placeholder:opacity-50"
				placeholder="Search"
				value={searchQuery}
				onChange={onSearchQueryChange}
			/>
			<button
				className="shrink-0 absolute right-[12px] top-[6px] text-sky-500 disabled:text-white disabled:text-opacity-50 transition-colors ease-linear"
				disabled={!trimmedSearchQuery}
			>
				<FontAwesomeIcon icon={faSearch} />
			</button>
		</form>
	)
}

export default ConversationsSearch
