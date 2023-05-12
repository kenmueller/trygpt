'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useSetRecoilState } from 'recoil'

import conversationsSearchQueryState from '@/lib/atoms/conversationsSearchQuery'
import useImmediateEffect from '@/lib/useImmediateEffect'

const SetConversationsLayoutState = () => {
	const setSearchQuery = useSetRecoilState(conversationsSearchQueryState)

	const pathname = usePathname()
	const isSearchPage = pathname === '/conversations/search'

	const searchParams = useSearchParams()
	const searchQuery = searchParams.get('q') ?? ''

	useImmediateEffect(() => {
		if (isSearchPage) setSearchQuery(searchQuery)
	}, [isSearchPage, searchQuery, setSearchQuery])

	return null
}

export default SetConversationsLayoutState
