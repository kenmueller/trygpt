'use client'

import { useRecoilValue } from 'recoil'

import leaderboardState from '@/lib/atoms/leaderboard'
import UserRow from './UserRow'

const LeaderboardPageUsers = () => {
	const users = useRecoilValue(leaderboardState)
	if (!users) throw new Error('Missing leaderboard')

	return (
		<div className="flex flex-col items-stretch gap-4">
			{users.map((user, index) => (
				<UserRow key={user.id} index={index} user={user} />
			))}
		</div>
	)
}

export default LeaderboardPageUsers
