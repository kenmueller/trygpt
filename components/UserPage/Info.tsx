'use client'

import { useRecoilValue } from 'recoil'

import publicUserState from '@/lib/atoms/publicUser'

const UserPageInfo = () => {
	const publicUser = useRecoilValue(publicUserState)
	if (!publicUser) throw new Error('Missing publicUser')

	return (
		<div>
			<h1>{publicUser.name}</h1>
		</div>
	)
}

export default UserPageInfo
