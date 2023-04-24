import { atom } from 'recoil'

import Chat from '@/lib/chat'

const chatsState = atom<Chat[]>({
	key: 'chats',
	default: []
})

export default chatsState
