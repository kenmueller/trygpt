import { Dispatch, SetStateAction, createContext } from 'react'

import ChatMessage from '@/lib/chat/message'

const ChatMessagesContext = createContext<
	[ChatMessage[] | null, Dispatch<SetStateAction<ChatMessage[] | null>>]
>(undefined as never)

export default ChatMessagesContext
