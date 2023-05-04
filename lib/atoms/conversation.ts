import { atom } from 'recoil'

import { ConversationWithUserAndChatAndPointData } from '@/lib/conversation'

const conversationState = atom<ConversationWithUserAndChatAndPointData | null>({
	key: 'conversation',
	default: null
})

export default conversationState
