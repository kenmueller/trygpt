import { MutableRefObject } from 'react'
import { atom } from 'recoil'

const chatMessagesContainerRef = atom<MutableRefObject<HTMLDivElement | null>>({
	key: 'chatMessagesContainer',
	default: { current: null },
	dangerouslyAllowMutability: true
})

export default chatMessagesContainerRef
