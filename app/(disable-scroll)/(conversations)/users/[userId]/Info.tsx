'use client'

import Image from 'next/image'
import { useRecoilValue } from 'recoil'

import publicUserState from '@/lib/atoms/publicUser'
import defaultUserImage from '@/assets/user.png'
import formatDate from '@/lib/date/format'

const UserPageInfo = () => {
	const publicUser = useRecoilValue(publicUserState)
	if (!publicUser) throw new Error('Missing publicUser')

	return (
		<div className="flex items-start gap-4">
			<Image
				className="rounded-xl"
				src={publicUser.photo ?? defaultUserImage}
				alt={publicUser.name}
				referrerPolicy={publicUser.photo ? 'no-referrer' : undefined}
				width={50}
				height={50}
				priority
			/>
			<div className="flex flex-col gap-2">
				<h1>{publicUser.name}</h1>
				<p className="font-bold text-white text-opacity-50">
					{publicUser.points} point{publicUser.points === 1 ? '' : 's'} • Joined{' '}
					{formatDate(publicUser.created)}
				</p>
			</div>
		</div>
	)
}

export default UserPageInfo
