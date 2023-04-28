import { atom } from 'recoil'

const isSpeechStartedState = atom({
	key: 'isSpeechStarted',
	default: false
})

export default isSpeechStartedState
