import { Dispatch, SetStateAction, createContext } from 'react'

import ChatMessage from '@/lib/chat/message'

export type InitialMessage = Pick<ChatMessage, 'role' | 'text'>

const InitialMessagesContext = createContext<
	[InitialMessage[] | null, Dispatch<SetStateAction<InitialMessage[] | null>>]
>(undefined as never)

export default InitialMessagesContext
