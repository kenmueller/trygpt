import { atom } from 'recoil'

const isMobileState = atom({
	key: 'isMobile',
	default: false
})

export default isMobileState
