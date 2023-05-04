import { atom } from 'recoil'

import ChatMessage from '@/lib/chat/message'

const conversationChatMessagesState = atom<ChatMessage[] | null>({
	key: 'conversationChatMessages',
	default: null
})

export default conversationChatMessagesState
