'use client'

import { useRecoilValue } from 'recoil'

import userState from '@/lib/atoms/user'
import ConversationsLink from './ConversationsLink'
import ProfileLink from './ProfileLink'
import SignOutButton from './SignOutButton'
import SignInButton from './SignInButton'

const SidebarSettings = () => {
	const user = useRecoilValue(userState)

	return (
		<div className="flex flex-col items-stretch">
			{user && <ProfileLink />}
			<ConversationsLink />
			{user ? <SignOutButton /> : <SignInButton />}
		</div>
	)
}

export default SidebarSettings
