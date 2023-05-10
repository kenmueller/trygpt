import { atom } from 'recoil'

import { ConversationWithUserAndChatAndPointData } from '@/lib/conversation'

const publicUserConversationsState = atom<
	ConversationWithUserAndChatAndPointData[] | null
>({
	key: 'publicUserConversations',
	default: null
})

export default publicUserConversationsState
