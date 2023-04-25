import { atom } from 'recoil'

const isSidebarShowingState = atom({
	key: 'isSidebarShowing',
	default: false
})

export default isSidebarShowingState
