import { atom } from 'recoil'

import ChatMessage from '@/lib/chat/message'

const chatMessagesState = atom<ChatMessage[]>({
	key: 'chatMessages',
	default: []
})

export default chatMessagesState
