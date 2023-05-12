'use client'

import { useSetRecoilState } from 'recoil'

import useImmediateEffect from '@/lib/useImmediateEffect'
import { ConversationWithUserAndChatAndPointData } from '@/lib/conversation'
import conversationsState from '@/lib/atoms/conversations'

const SetConversationPageState = ({
	conversations
}: {
	conversations: Promise<ConversationWithUserAndChatAndPointData[]>
}) => {
	const setConversations = useSetRecoilState(conversationsState)

	useImmediateEffect(() => {
		setConversations(null)
		conversations.then(setConversations)
	}, [conversations, setConversations])

	return null
}

export default SetConversationPageState
