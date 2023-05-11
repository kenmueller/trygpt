'use client'

import { useRecoilValue } from 'recoil'

import conversationsState from '@/lib/atoms/conversations'
import ConversationRow from '@/components/Conversations/ConversationRow'

const ConversationsPageConversations = () => {
	const conversations = useRecoilValue(conversationsState)
	if (!conversations) throw new Error('Missing conversations')

	return (
		<div className="flex flex-col items-stretch gap-4 max-w-[1500px] w-[95%]">
			{conversations.length ? (
				conversations.map(conversation => (
					<ConversationRow
						key={conversation.id}
						state={conversationsState}
						conversation={conversation}
					/>
				))
			) : (
				<p className="mt-4 text-center font-bold text-white text-opacity-50">
					No conversations
				</p>
			)}
		</div>
	)
}

export default ConversationsPageConversations
