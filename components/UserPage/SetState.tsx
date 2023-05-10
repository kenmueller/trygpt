'use client'

import { useSetRecoilState } from 'recoil'

import useImmediateEffect from '@/lib/useImmediateEffect'
import { PublicUser } from '@/lib/user'
import { ConversationWithUserAndChatAndPointData } from '@/lib/conversation'
import publicUserState from '@/lib/atoms/publicUser'
import publicUserConversationsState from '@/lib/atoms/publicUserConversations'

const SetUserPageState = ({
	publicUser,
	conversations
}: {
	publicUser: PublicUser
	conversations: Promise<ConversationWithUserAndChatAndPointData[]>
}) => {
	const setPublicUser = useSetRecoilState(publicUserState)
	const setConversations = useSetRecoilState(publicUserConversationsState)

	useImmediateEffect(() => {
		setPublicUser(publicUser)
	}, [publicUser, setPublicUser])

	useImmediateEffect(() => {
		setConversations(null)
		conversations.then(setConversations)
	}, [conversations, setConversations])

	return null
}

export default SetUserPageState
