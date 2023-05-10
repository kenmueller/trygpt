'use client'

import Link from 'next/link'
import Image from 'next/image'

import formatDate from '@/lib/date/format'
import { PublicUser } from '@/lib/user'
import defaultUserImage from '@/assets/user.png'

const LeaderboardPageUserRow = ({
	index,
	user
}: {
	index: number
	user: PublicUser
}) => (
	<Link
		className="group flex items-start gap-4 px-4 py-3 bg-white bg-opacity-5 rounded-xl"
		href={`/users/${encodeURIComponent(user.id)}`}
	>
		<span className="min-w-[57px] text-3xl font-extrabold">#{index + 1}</span>
		<span className="flex flex-col items-stretch gap-2">
			<span className="flex items-center gap-2 text-xl font-bold group-hover:underline">
				<Image
					className="rounded-lg"
					src={user.photo ?? defaultUserImage}
					alt={user.name}
					referrerPolicy={user.photo ? 'no-referrer' : undefined}
					width={30}
					height={30}
				/>
				{user.name}
			</span>
			<span className="font-bold text-white text-opacity-50">
				{user.points} point{user.points === 1 ? '' : 's'} • Joined{' '}
				{formatDate(user.created)}
			</span>
		</span>
	</Link>
)

export default LeaderboardPageUserRow
