import { atom } from 'recoil'

import { ConversationWithUserAndChatData } from '@/lib/conversation'

const conversationState = atom<ConversationWithUserAndChatData | null>({
	key: 'conversation',
	default: null
})

export default conversationState
