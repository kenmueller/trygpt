'use client'

import { useRecoilValue } from 'recoil'

import publicUserConversationsState from '@/lib/atoms/publicUserConversations'
import ConversationRow from '@/components/Conversations/ConversationRow'

const UserPageConversations = () => {
	const conversations = useRecoilValue(publicUserConversationsState)
	if (!conversations) throw new Error('Missing conversations')

	return (
		<div>
			{conversations.map(conversation => (
				<ConversationRow key={conversation.id} conversation={conversation} />
			))}
		</div>
	)
}

export default UserPageConversations
