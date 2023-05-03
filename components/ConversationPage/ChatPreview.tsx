import ChatMessage from '@/lib/chat/message'
import ChatPreview from '@/components/Conversations/ChatPreview'
import { ConversationWithUserAndChatData } from '@/lib/conversation'

const ConversationPageChatPreview = async ({
	conversation,
	messages: messagesPromise
}: {
	conversation: ConversationWithUserAndChatData
	messages: Promise<ChatMessage[]>
}) => {
	const messages = await messagesPromise

	return (
		<ChatPreview
			chat={{ id: conversation.chatId, name: conversation.chatName }}
			user={{ photo: conversation.userPhoto, name: conversation.userName }}
			messages={messages}
		/>
	)
}

export default ConversationPageChatPreview
