import { atom } from 'recoil'

import { PublicUser } from '@/lib/user'

const publicUserState = atom<PublicUser | null>({
	key: 'publicUser',
	default: null
})

export default publicUserState
