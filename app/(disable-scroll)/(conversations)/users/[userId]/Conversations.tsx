'use client'

import { useRecoilValue } from 'recoil'

import publicUserConversationsState from '@/lib/atoms/publicUserConversations'
import ConversationRow from '@/components/Conversation/ConversationRow'
import publicUserState from '@/lib/atoms/publicUser'

const UserPageConversations = () => {
	const publicUser = useRecoilValue(publicUserState)
	const conversations = useRecoilValue(publicUserConversationsState)

	if (!(publicUser && conversations))
		throw new Error('Missing publicUser or conversations')

	return (
		<div className="flex flex-col items-stretch gap-4">
			{conversations.length ? (
				conversations.map(conversation => (
					<ConversationRow
						key={conversation.id}
						state={publicUserConversationsState}
						conversation={conversation}
						userLink={false}
					/>
				))
			) : (
				<p className="text-center font-bold text-white text-opacity-50">
					{publicUser.name} has no conversations
				</p>
			)}
		</div>
	)
}

export default UserPageConversations
