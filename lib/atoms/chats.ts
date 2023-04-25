import { atom } from 'recoil'

import Chat from '@/lib/chat'

const chatsState = atom<Chat[] | null>({
	key: 'chats',
	default: null
})

export default chatsState
