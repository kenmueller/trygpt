import { atom } from 'recoil'

import { PublicUser } from '@/lib/user'

const leaderboardState = atom<PublicUser[] | null>({
	key: 'leaderboard',
	default: null
})

export default leaderboardState
