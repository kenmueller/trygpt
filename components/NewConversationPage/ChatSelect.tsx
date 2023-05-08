'use client'

import { useCallback, useMemo } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import Select from 'react-select'

import newConversationChatsState from '@/lib/atoms/newConversationChats'
import newConversationSelectedChatIdState from '@/lib/atoms/newConversationSelectedChatId'

import styles from './ChatSelect.module.scss'

const NewConversationChatSelect = () => {
	const [selectedChatId, setSelectedChatId] = useRecoilState(
		newConversationSelectedChatIdState
	)
	const chats = useRecoilValue(newConversationChatsState)

	if (!chats) throw new Error('Missing chats')

	const options = useMemo(
		() =>
			chats.map(chat => ({
				value: chat.id,
				label: chat.name ?? 'Untitled'
			})),
		[chats]
	)

	const selectedOption = selectedChatId
		? options.find(option => option.value === selectedChatId) ?? null
		: null

	const setSelectedOption = useCallback(
		(option: { value: string; label: string } | null) => {
			setSelectedChatId(option?.value ?? null)
		},
		[setSelectedChatId]
	)

	return (
		<Select
			className={styles.root}
			classNamePrefix="select"
			placeholder="Select chat..."
			value={selectedOption}
			onChange={setSelectedOption}
			options={options}
		/>
	)
}

export default NewConversationChatSelect
