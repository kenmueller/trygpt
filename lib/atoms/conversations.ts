import { atom } from 'recoil'

import { ConversationWithUserAndChatAndPointData } from '@/lib/conversation'

const conversationsState = atom<
	ConversationWithUserAndChatAndPointData[] | null
>({
	key: 'conversations',
	default: null
})

export default conversationsState
