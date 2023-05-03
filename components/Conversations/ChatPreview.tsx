import Link from 'next/link'

import { ChatWithUserData } from '@/lib/chat'
import ChatMessage from '@/lib/chat/message'

const ConversationChatPreview = ({
	chat,
	messages
}: {
	chat: ChatWithUserData
	messages: ChatMessage[]
}) => (
	<div>
		<pre>
			<code>{JSON.stringify(messages)}</code>
		</pre>
		<Link href={`/chats/${encodeURIComponent(chat.id)}`}>
			Continue this chat
		</Link>
	</div>
)

export default ConversationChatPreview
