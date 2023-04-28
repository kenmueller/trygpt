'use client'

import { useCallback, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faMessage, faTrash } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import Chat from '@/lib/chat'
import isSidebarShowingState from '@/lib/atoms/isSidebarShowing'
import isMobileState from '@/lib/atoms/isMobile'
import alertError from '@/lib/error/alert'
import errorFromUnknown from '@/lib/error/fromUnknown'
import chatState from '@/lib/atoms/chat'
import chatsState from '@/lib/atoms/chats'
import errorFromResponse from '@/lib/error/fromResponse'

const PATHNAME_MATCH = /^\/chats\/(.+)$/

const SidebarChatLink = ({ chat }: { chat: Chat }) => {
	const router = useRouter()

	const isMobile = useRecoilValue(isMobileState)

	const setChat = useSetRecoilState(chatState)
	const setChats = useSetRecoilState(chatsState)

	const setIsSidebarShowing = useSetRecoilState(isSidebarShowingState)

	const pathname = usePathname()
	const currentChatId = pathname.match(PATHNAME_MATCH)?.[1] ?? null

	const active = chat.id === currentChatId

	const hideSidebar = useCallback(() => {
		setIsSidebarShowing(false)
	}, [setIsSidebarShowing])

	const [isEditChatLoading, setIsEditChatLoading] = useState(false)

	const editChat = useCallback(async () => {
		try {
			setIsEditChatLoading(true)

			const newName = prompt('Edit chat name', chat.name ?? 'Untitled')
			if (!newName) return

			const response = await fetch(
				`/api/chats/${encodeURIComponent(chat.id)}/name`,
				{
					method: 'PATCH',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ type: 'value', value: newName })
				}
			)

			if (!response.ok) throw await errorFromResponse(response)

			setChat(
				otherChat =>
					otherChat &&
					(otherChat.id === chat.id
						? { ...otherChat, name: newName, updated: Date.now() }
						: otherChat)
			)

			setChats(
				chats =>
					chats &&
					chats.map(otherChat =>
						otherChat.id === chat.id
							? { ...otherChat, name: newName, updated: Date.now() }
							: otherChat
					)
			)
		} catch (unknownError) {
			alertError(errorFromUnknown(unknownError))
		} finally {
			setIsEditChatLoading(false)
		}
	}, [chat, setChat, setChats, setIsEditChatLoading])

	const [isDeleteChatLoading, setIsDeleteChatLoading] = useState(false)

	const deleteChat = useCallback(async () => {
		try {
			setIsDeleteChatLoading(true)

			if (
				!confirm(
					`Are you sure you want to delete "${chat.name ?? 'Untitled'}"?`
				)
			)
				return

			const response = await fetch(
				`/api/chats/${encodeURIComponent(chat.id)}`,
				{ method: 'DELETE' }
			)

			if (!response.ok) throw await errorFromResponse(response)

			setChats(
				chats => chats && chats.filter(otherChat => otherChat.id !== chat.id)
			)

			if (active) router.push('/chats/new')
		} catch (unknownError) {
			alertError(errorFromUnknown(unknownError))
		} finally {
			setIsDeleteChatLoading(false)
		}
	}, [chat, active, router, setChats, setIsDeleteChatLoading])

	return (
		<div
			className={cx(
				'group relative transition-colors ease-linear hover:bg-white hover:bg-opacity-10',
				active && 'bg-white bg-opacity-10'
			)}
		>
			<Link
				className={cx(
					'flex items-center gap-4 px-4 py-2',
					active && 'pointer-events-none'
				)}
				aria-current={active ? 'page' : undefined}
				href={`/chats/${encodeURIComponent(chat.id)}`}
				onClick={hideSidebar}
			>
				<FontAwesomeIcon
					className="shrink-0 w-[30px] text-xl"
					icon={faMessage}
				/>
				{chat.name ?? 'Untitled'}
			</Link>
			<div
				className={cx(
					'absolute right-1 top-1 flex items-center bg-[#6c6c6e] rounded-md pointer-events-none opacity-0 transition-opacity ease-linear',
					!isMobile &&
						'group-hover:pointer-events-auto group-hover:opacity-100',
					isMobile && active && 'pointer-events-auto opacity-100'
				)}
			>
				<button
					className="pl-2 pr-1 py-0.5 transition-opacity ease-linear hover:opacity-70 disabled:opacity-50"
					disabled={isEditChatLoading}
					onClick={editChat}
				>
					<FontAwesomeIcon icon={faEdit} />
				</button>
				<button
					className="pl-1 pr-2 py-0.5 transition-opacity ease-linear hover:opacity-70 disabled:opacity-50"
					disabled={isDeleteChatLoading}
					onClick={deleteChat}
				>
					<FontAwesomeIcon icon={faTrash} />
				</button>
			</div>
		</div>
	)
}

export default SidebarChatLink
