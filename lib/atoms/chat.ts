import { atom } from 'recoil'

import { ChatWithUserData } from '@/lib/chat'

const chatState = atom<ChatWithUserData>({
	key: 'chat',
	default: null as unknown as ChatWithUserData
})

export default chatState
