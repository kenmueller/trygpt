import { atom } from 'recoil'

import ChatMessage from '@/lib/chat/message'

const chatMessagesState = atom<ChatMessage[] | null>({
	key: 'chatMessages',
	default: null
})

export default chatMessagesState
