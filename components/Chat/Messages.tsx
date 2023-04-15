import chatMessagesFromChatId from '@/lib/chat/message/fromChatId'
import MessagesResolved from './MessagesResolved'
import { ChatWithUserData } from '@/lib/chat'

const ChatMessages = async ({ chat }: { chat: ChatWithUserData }) => {
	const messages = await chatMessagesFromChatId(chat.id)
	return <MessagesResolved chat={chat} initialValue={messages} />
}

export default ChatMessages
