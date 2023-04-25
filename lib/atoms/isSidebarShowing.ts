import { atom } from 'recoil'

const isSidebarShowingState = atom({
	key: 'isSidebarShowing',
	default: true //false
})

export default isSidebarShowingState
