import chatMessagesFromChatId from '@/lib/chat/message/fromChatId'
import MessagesResolved from './MessagesResolved'

const ChatMessages = async ({ chatId }: { chatId: string }) => {
	const messages = await chatMessagesFromChatId(chatId)
	return <MessagesResolved initialValue={messages} />
}

export default ChatMessages
