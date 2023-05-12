'use client'

import { useSetRecoilState } from 'recoil'

import useImmediateEffect from '@/lib/useImmediateEffect'
import { PublicUser } from '@/lib/user'
import leaderboardState from '@/lib/atoms/leaderboard'

const SetLeaderboardPageState = ({
	leaderboard
}: {
	leaderboard: Promise<PublicUser[]>
}) => {
	const setLeaderboard = useSetRecoilState(leaderboardState)

	useImmediateEffect(() => {
		setLeaderboard(null)
		leaderboard.then(setLeaderboard)
	}, [leaderboard, setLeaderboard])

	return null
}

export default SetLeaderboardPageState
