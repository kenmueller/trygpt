import { selector } from 'recoil'

import chatsState from './chats'

const sortedChatsState = selector({
	key: 'sortedChats',
	get: ({ get }) => {
		const chats = get(chatsState)
		return chats && [...chats].sort((a, b) => b.updated - a.updated)
	}
})

export default sortedChatsState
