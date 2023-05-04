import { atom } from 'recoil'

const isBotState = atom({
	key: 'isBot',
	default: false
})

export default isBotState
