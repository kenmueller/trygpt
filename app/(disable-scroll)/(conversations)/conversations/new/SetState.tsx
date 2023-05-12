'use client'

import { useSetRecoilState } from 'recoil'

import useImmediateEffect from '@/lib/useImmediateEffect'
import Chat from '@/lib/chat'
import newConversationChatsState from '@/lib/atoms/newConversationChats'
import newConversationSelectedChatIdState from '@/lib/atoms/newConversationSelectedChatId'

const SetNewConversationPageState = ({
	selectedChatId,
	chats
}: {
	selectedChatId: string | null
	chats: Promise<Chat[]> | null
}) => {
	const setSelectedChatId = useSetRecoilState(
		newConversationSelectedChatIdState
	)
	const setChats = useSetRecoilState(newConversationChatsState)

	useImmediateEffect(() => {
		setSelectedChatId(selectedChatId)
	}, [selectedChatId, setSelectedChatId])

	useImmediateEffect(() => {
		setChats(null)
		chats?.then(setChats)
	}, [chats, setChats])

	return null
}

export default SetNewConversationPageState
