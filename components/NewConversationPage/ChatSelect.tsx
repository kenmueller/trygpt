'use client'

import Link from 'next/link'
import { useCallback, useMemo } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import Select from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

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
		<div className="flex items-stretch gap-4">
			<Select
				className={cx('grow-[1]', styles.select)}
				classNamePrefix="select"
				placeholder="Select chat..."
				value={selectedOption}
				onChange={setSelectedOption}
				options={options}
			/>
			<Link
				className="shrink-0 flex items-center gap-2 px-4 text-lg font-bold bg-sky-500 rounded-lg hover:opacity-70 transition-opacity ease-linear"
				href="/chats/new"
			>
				<FontAwesomeIcon icon={faPlus} />
				<span className="hidden min-[450px]:inline">New</span>
			</Link>
		</div>
	)
}

export default NewConversationChatSelect
