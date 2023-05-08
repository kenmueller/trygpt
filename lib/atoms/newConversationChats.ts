import { atom } from 'recoil'

import Chat from '@/lib/chat'

const newConversationChatsState = atom<Chat[] | null>({
	key: 'newConversationChats',
	default: null
})

export default newConversationChatsState
