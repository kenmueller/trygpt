import { atom } from 'recoil'

import { ChatWithUserData } from '@/lib/chat'

const chatState = atom<ChatWithUserData | null>({
	key: 'chat',
	default: null
})

export default chatState
