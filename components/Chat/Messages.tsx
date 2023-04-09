import chatMessagesFromChatId from '@/lib/chat/message/fromChatId'
import MessagesResolved from './MessagesResolved'
import Chat from '@/lib/chat'

const ChatMessages = async ({ chat }: { chat: Chat }) => {
	const messages = await chatMessagesFromChatId(chat.id)
	return <MessagesResolved initialValue={messages} />
}

export default ChatMessages
