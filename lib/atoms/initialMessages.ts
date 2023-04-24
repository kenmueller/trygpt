import { atom } from 'recoil'

import ChatMessage from '@/lib/chat/message'

export type InitialMessage = Pick<ChatMessage, 'role' | 'text'>

const initialMessagesState = atom<InitialMessage[] | null>({
	key: 'initialMessages',
	default: null
})

export default initialMessagesState
