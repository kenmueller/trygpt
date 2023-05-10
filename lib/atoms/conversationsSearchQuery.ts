import { atom } from 'recoil'

const conversationsSearchQueryState = atom({
	key: 'conversationsSearchQuery',
	default: ''
})

export default conversationsSearchQueryState
