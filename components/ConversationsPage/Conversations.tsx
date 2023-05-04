'use client'

import { useRecoilValue } from 'recoil'

import conversationsState from '@/lib/atoms/conversations'
import ConversationRow from '@/components/Conversations/ConversationRow'

const ConversationsPageConversations = () => {
	const conversations = useRecoilValue(conversationsState)

	return (
		<div className="flex flex-col items-stretch gap-4 max-w-[1500px] w-[95%]">
			{conversations?.map(conversation => (
				<ConversationRow key={conversation.id} conversation={conversation} />
			))}
		</div>
	)
}

export default ConversationsPageConversations
