'use client'

import { useCallback, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faArrowDown,
	faArrowUp,
	faShareSquare,
	faTrash
} from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'
import copy from 'copy-to-clipboard'
import { toast } from 'react-toastify'
import Link from 'next/link'

import conversationState from '@/lib/atoms/conversation'
import formatDate from '@/lib/date/format'
import Markdown from '@/components/Markdown'
import userState from '@/lib/atoms/user'
import errorFromResponse from '@/lib/error/fromResponse'
import errorFromUnknown from '@/lib/error/fromUnknown'
import alertError from '@/lib/error/alert'
import defaultUserImage from '@/assets/user.png'
import { logEvent } from '@/lib/analytics/lazy'
import ORIGIN from '@/lib/origin'

const _deleteConversation = async (id: string) => {
	const response = await fetch(`/api/conversations/${encodeURIComponent(id)}`, {
		method: 'DELETE'
	})

	if (!response.ok) throw await errorFromResponse(response)
}

const ConversationPageInfo = () => {
	const router = useRouter()

	const user = useRecoilValue(userState)

	const [conversation, setConversation] = useRecoilState(conversationState)
	if (!conversation) throw new Error('Conversation not found')

	const canUpdatePoints = user && user.id !== conversation.userId
	const isOwner = user && user.id === conversation.userId

	const updateConversation = useCallback(
		(upvoted: boolean | null) => {
			setConversation(conversation => {
				if (!conversation) return null

				const incrementUpvotes =
					upvoted === true
						? conversation.upvoted === true
							? 0
							: 1
						: conversation.upvoted === true
						? -1
						: 0

				const incrementDownvotes =
					upvoted === false
						? conversation.upvoted === false
							? 0
							: 1
						: conversation.upvoted === false
						? -1
						: 0

				const incrementPoints = incrementUpvotes - incrementDownvotes

				return {
					...conversation,
					upvotes: conversation.upvotes + incrementUpvotes,
					downvotes: conversation.downvotes + incrementDownvotes,
					points: conversation.points + incrementPoints,
					upvoted,
					userPoints: conversation.userPoints + incrementPoints
				}
			})
		},
		[setConversation]
	)

	const setUpvoted = useCallback(
		async (upvoted: boolean | null) => {
			try {
				const response = await fetch(
					`/api/conversations/${encodeURIComponent(conversation.id)}/points`,
					{
						method: 'POST',
						headers: { 'content-type': 'application/json' },
						body: JSON.stringify(upvoted)
					}
				)

				if (!response.ok) throw await errorFromResponse(response)
			} catch (unknownError) {
				alertError(errorFromUnknown(unknownError))
			}
		},
		[conversation.id]
	)

	const upvote = useCallback(() => {
		if (!canUpdatePoints) return

		const upvoted = conversation.upvoted === true ? null : true

		updateConversation(upvoted)
		setUpvoted(upvoted)
	}, [canUpdatePoints, conversation.upvoted, updateConversation, setUpvoted])

	const downvote = useCallback(() => {
		if (!canUpdatePoints) return

		const upvoted = conversation.upvoted === false ? null : false

		updateConversation(upvoted)
		setUpvoted(upvoted)
	}, [canUpdatePoints, conversation.upvoted, updateConversation, setUpvoted])

	const share = useCallback(() => {
		logEvent('click_share_conversation')

		copy(
			new URL(
				`/conversations/${encodeURIComponent(
					conversation.id
				)}/${encodeURIComponent(conversation.slug)}`,
				ORIGIN
			).href
		)
		toast.success('Conversation link copied to clipboard')
	}, [conversation.id, conversation.slug])

	const [isDeleteLoading, setIsDeleteLoading] = useState(false)

	const deleteConversation = useCallback(async () => {
		try {
			if (
				!confirm(
					`Are you sure you want to permanently delete "${
						conversation.title || conversation.chatName || 'Untitled'
					}"?`
				)
			)
				return

			setIsDeleteLoading(true)

			await toast.promise(_deleteConversation(conversation.id), {
				pending: 'Deleting conversation...',
				success: 'Deleted conversation',
				error: 'Failed to delete conversation'
			})

			router.push('/conversations')
		} catch (unknownError) {
			setIsDeleteLoading(false)
			alertError(errorFromUnknown(unknownError))
		}
	}, [router, conversation.id, conversation.title, conversation.chatName])

	return (
		<>
			<div className="flex items-start gap-3 min-[600px]:gap-6">
				<div className="shrink-0 flex flex-col items-center pt-1">
					<button
						className={cx(
							'leading-4 px-2 py-1.5 bg-opacity-10 rounded-lg transition-colors ease-linear',
							conversation.upvoted === true
								? 'text-sky-500 bg-sky-500'
								: 'text-white bg-white',
							!canUpdatePoints && '!cursor-default text-opacity-50 bg-opacity-5'
						)}
						aria-label={`${conversation.upvotes}`}
						data-balloon-pos="right"
						onClick={upvote}
					>
						<FontAwesomeIcon icon={faArrowUp} />
					</button>
					<p className="font-bold">{conversation.points}</p>
					<button
						className={cx(
							'leading-4 px-2 py-1.5 bg-opacity-10 rounded-lg transition-colors ease-linear',
							conversation.upvoted === false
								? 'text-orange-500 bg-orange-500'
								: 'text-white bg-white',
							!canUpdatePoints && '!cursor-default text-opacity-50 bg-opacity-5'
						)}
						aria-label={`${conversation.downvotes}`}
						data-balloon-pos="right"
						onClick={downvote}
					>
						<FontAwesomeIcon icon={faArrowDown} />
					</button>
				</div>
				<div className="grow-[1] flex flex-col items-stretch gap-2">
					<h1 className="text-2xl min-[600px]:text-3xl">
						{conversation.title || conversation.chatName || 'Untitled'}
					</h1>
					<div className="flex flex-col items-start gap-1">
						<Link
							className="flex items-center gap-2 font-bold text-white text-opacity-50 hover:underline"
							href={`/users/${encodeURIComponent(conversation.userId)}`}
						>
							<Image
								className="rounded-lg"
								src={conversation.userPhoto ?? defaultUserImage}
								alt={conversation.userName}
								referrerPolicy={
									conversation.userPhoto ? 'no-referrer' : undefined
								}
								width={25}
								height={25}
								priority
							/>
							{conversation.userName} ({conversation.userPoints})
						</Link>
						<p className="font-bold text-white text-opacity-50">
							{conversation.views} view{conversation.views === 1 ? '' : 's'} •{' '}
							<a className="hover:underline" href="#comments">
								{conversation.comments} comment
								{conversation.comments === 1 ? '' : 's'}
							</a>{' '}
							• {formatDate(conversation.created)} •
							<button
								className="inline-flex items-center ml-1.5 align-middle translate-y-[-1.5px] font-bold text-white text-opacity-50 transition-opacity ease-linear hover:opacity-70"
								onClick={share}
							>
								<FontAwesomeIcon className="mr-1" icon={faShareSquare} />
								<span className="translate-y-[1px]">Share</span>
							</button>
							{isOwner && (
								<>
									{' '}
									•
									<button
										className="inline-flex items-center ml-1.5 align-middle translate-y-[-1.5px] font-bold text-red-500 transition-opacity ease-linear hover:opacity-70 disabled:opacity-50"
										disabled={isDeleteLoading}
										onClick={deleteConversation}
									>
										<FontAwesomeIcon className="mr-1" icon={faTrash} />
										<span className="translate-y-[1px]">Delete</span>
									</button>
								</>
							)}
						</p>
					</div>
				</div>
			</div>
			{conversation.text && <Markdown text={conversation.text} />}
		</>
	)
}

export default ConversationPageInfo
