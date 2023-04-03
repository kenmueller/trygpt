import Chat from '@/lib/chat'
import ChatsResolved from './ChatsResolved'

const SidebarChats = async ({
	chats: chatsPromise
}: {
	chats: Promise<Chat[]>
}) => {
	const chats = await chatsPromise
	return <ChatsResolved initialValue={chats} />
}

export default SidebarChats
