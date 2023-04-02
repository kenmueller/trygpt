import Chat from '@/lib/chat'
import ChatLink from './ChatLink'

const SidebarChats = async ({
	chats: chatsPromise
}: {
	chats: Promise<Chat[]>
}) => {
	const chats = await chatsPromise

	return chats.map(chat => <ChatLink key={chat.id} chat={chat} />)
}

export default SidebarChats
