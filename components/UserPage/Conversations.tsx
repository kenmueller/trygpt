'use client'

import { useRecoilValue } from 'recoil'

import publicUserConversationsState from '@/lib/atoms/publicUserConversations'
import ConversationRow from '@/components/Conversations/ConversationRow'

const UserPageConversations = () => {
	const conversations = useRecoilValue(publicUserConversationsState)
	if (!conversations) throw new Error('Missing conversations')

	return (
		<div className="flex flex-col items-stretch gap-4">
			<h2>Conversations</h2>
			{conversations.map(conversation => (
				<ConversationRow
					key={conversation.id}
					conversation={conversation}
					userLink={false}
				/>
			))}
		</div>
	)
}

export default UserPageConversations
