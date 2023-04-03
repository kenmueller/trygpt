import { Dispatch, SetStateAction, createContext } from 'react'

import Chat from '@/lib/chat'

const ChatsContext = createContext<
	[Chat[] | null, Dispatch<SetStateAction<Chat[] | null>>]
>(undefined as never)

export default ChatsContext
