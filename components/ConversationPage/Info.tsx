'use client'

import { useCallback } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import conversationState from '@/lib/atoms/conversation'
import formatDate from '@/lib/date/format'
import Markdown from '@/components/Markdown'
import userState from '@/lib/atoms/user'
import errorFromResponse from '@/lib/error/fromResponse'
import errorFromUnknown from '@/lib/error/fromUnknown'
import alertError from '@/lib/error/alert'
import defaultUserImage from '@/assets/user.png'

const ConversationPageInfo = () => {
	const user = useRecoilValue(userState)

	const [conversation, setConversation] = useRecoilState(conversationState)
	if (!conversation) throw new Error('Conversation not found')

	const canUpdatePoints = user && user.id !== conversation.userId

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

	return (
		<>
			<div className="flex items-start gap-6">
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
					<h1>{conversation.title}</h1>
					<div className="flex flex-col items-stretch gap-1">
						<p className="flex items-center gap-2 font-bold text-white text-opacity-50">
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
						</p>
						<p className="font-bold text-white text-opacity-50">
							{conversation.views} view{conversation.views === 1 ? '' : 's'} •{' '}
							<a className="hover:underline" href="#comments">
								{conversation.comments} comment
								{conversation.comments === 1 ? '' : 's'}
							</a>{' '}
							• {formatDate(conversation.created)}
						</p>
					</div>
				</div>
			</div>
			{conversation.text && <Markdown text={conversation.text} />}
		</>
	)
}

export default ConversationPageInfo