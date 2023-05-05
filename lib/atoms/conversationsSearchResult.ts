import { atom } from 'recoil'

import { ConversationWithUserAndChatData } from '@/lib/conversation'

const conversationsSearchResultState = atom<
	ConversationWithUserAndChatData[] | null
>({
	key: 'conversationsSearchResult',
	default: null
})

export default conversationsSearchResultState
