import { atom } from 'recoil'

import { ConversationWithUserAndChatData } from '@/lib/conversation'

const conversationsState = atom<ConversationWithUserAndChatData[] | null>({
	key: 'conversations',
	default: null
})

export default conversationsState
