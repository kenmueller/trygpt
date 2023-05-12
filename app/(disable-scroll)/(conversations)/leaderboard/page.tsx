if (!process.env.NEXT_PUBLIC_LEADERBOARD_LIMIT)
	throw new Error('Missing NEXT_PUBLIC_LEADERBOARD_LIMIT')

import { Suspense } from 'react'

import pageMetadata from '@/lib/metadata/page'
import ThreeDotsLoader from '@/components/ThreeDotsLoader'
import SetLeaderboardPageState from './SetState'
import Users from './Users'
import Await from '@/components/Await'
import allPublicUsers from '@/lib/user/allPublic'

const LEADERBOARD_LIMIT = Number.parseInt(
	process.env.NEXT_PUBLIC_LEADERBOARD_LIMIT
)

export const generateMetadata = () =>
	pageMetadata({
		title: `Leaderboard | TryGPT`,
		description: `View the top ${LEADERBOARD_LIMIT} users on TryGPT`,
		previewTitle: 'Leaderboard'
	})

const LeaderboardPage = () => {
	const leaderboard = allPublicUsers(LEADERBOARD_LIMIT)

	return (
		<main className="flex flex-col items-center py-4 overflow-y-auto scroll-smooth">
			<SetLeaderboardPageState leaderboard={leaderboard} />
			<div className="flex flex-col items-stretch gap-4 max-w-[1500px] w-[95%]">
				<h1>Leaderboard</h1>
				<Suspense fallback={<ThreeDotsLoader className="mx-auto mt-4" />}>
					{/* @ts-expect-error */}
					<Await promise={leaderboard}>
						<Users />
					</Await>
				</Suspense>
			</div>
		</main>
	)
}

export default LeaderboardPage
