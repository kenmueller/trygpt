'use client'

import { useSetRecoilState } from 'recoil'

import useImmediateEffect from '@/lib/useImmediateEffect'
import { ConversationWithUserAndChatData } from '@/lib/conversation'
import conversationsSearchResultState from '@/lib/atoms/conversationsSearchResult'

const SetSearchConversationsPageState = ({
	searchResults
}: {
	searchResults: Promise<ConversationWithUserAndChatData[]>
}) => {
	const setSearchResults = useSetRecoilState(conversationsSearchResultState)

	useImmediateEffect(() => {
		setSearchResults(null)
		searchResults.then(setSearchResults)
	}, [searchResults, setSearchResults])

	return null
}

export default SetSearchConversationsPageState
