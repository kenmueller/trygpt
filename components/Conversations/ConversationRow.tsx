import Link from 'next/link'

import { ConversationWithUserAndChatData } from '@/lib/conversation'

const ConversationRow = ({
	conversation
}: {
	conversation: ConversationWithUserAndChatData
}) => (
	<Link
		href={`/conversations/${encodeURIComponent(
			conversation.id
		)}/${encodeURIComponent(conversation.slug)}`}
	>
		<span>{conversation.title}</span>
	</Link>
)

export default ConversationRow
