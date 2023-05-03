import Link from 'next/link'

import { ChatWithUserData } from '@/lib/chat'
import ChatMessage from '@/lib/chat/message'

const ConversationChatPreview = ({
	chat,
	messages,
	continueInNewTab = false
}: {
	chat: ChatWithUserData
	messages: ChatMessage[]
	continueInNewTab?: boolean
}) => {
	const continueHref = `/chats/${encodeURIComponent(chat.id)}`

	return (
		<div>
			<pre>
				<code>{JSON.stringify(messages)}</code>
			</pre>
			{continueInNewTab ? (
				<a href={continueHref} target="_blank">
					Continue this chat
				</a>
			) : (
				<Link href={continueHref}>Continue this chat</Link>
			)}
		</div>
	)
}

export default ConversationChatPreview
