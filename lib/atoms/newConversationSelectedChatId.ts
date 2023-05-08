import { atom } from 'recoil'

const newConversationSelectedChatIdState = atom<string | null>({
	key: 'newConversationSelectedChatId',
	default: null
})

export default newConversationSelectedChatIdState
