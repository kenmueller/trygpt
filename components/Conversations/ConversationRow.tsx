'use client'

import { MouseEvent, useCallback } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import { ConversationWithUserAndChatAndPointData } from '@/lib/conversation'
import mdToText from '@/lib/md/toText'
import defaultUserImage from '@/assets/user.png'
import formatDate from '@/lib/date/format'
import conversationsState from '@/lib/atoms/conversations'
import alertError from '@/lib/error/alert'
import errorFromUnknown from '@/lib/error/fromUnknown'
import errorFromResponse from '@/lib/error/fromResponse'
import userState from '@/lib/atoms/user'

const ConversationRow = ({
	conversation
}: {
	conversation: ConversationWithUserAndChatAndPointData
}) => {
	const user = useRecoilValue(userState)
	const setConversations = useSetRecoilState(conversationsState)

	const canUpdatePoints = user && user.id !== conversation.userId

	const updateConversation = useCallback(
		(upvoted: boolean | null) => {
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

			setConversations(
				conversations =>
					conversations &&
					conversations.map(otherConversation => {
						const newConversation = { ...otherConversation }

						let updated = false

						if (newConversation.id === conversation.id) {
							updated = true

							newConversation.upvotes += incrementUpvotes
							newConversation.downvotes += incrementDownvotes
							newConversation.points += incrementPoints
							newConversation.upvoted = upvoted
						}

						if (newConversation.userId === conversation.userId) {
							updated = true

							newConversation.userPoints += incrementPoints
						}

						return updated ? newConversation : otherConversation
					})
			)
		},
		[
			setConversations,
			conversation.id,
			conversation.userId,
			conversation.upvoted
		]
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

	const upvote = useCallback(
		(event: MouseEvent) => {
			if (!canUpdatePoints) return

			event.preventDefault()

			const upvoted = conversation.upvoted === true ? null : true

			updateConversation(upvoted)
			setUpvoted(upvoted)
		},
		[canUpdatePoints, conversation.upvoted, updateConversation, setUpvoted]
	)

	const downvote = useCallback(
		(event: MouseEvent) => {
			if (!canUpdatePoints) return

			event.preventDefault()

			const upvoted = conversation.upvoted === false ? null : false

			updateConversation(upvoted)
			setUpvoted(upvoted)
		},
		[canUpdatePoints, conversation.upvoted, updateConversation, setUpvoted]
	)

	return (
		<Link
			className="group flex items-start gap-4 px-4 py-3 bg-white bg-opacity-5 rounded-xl"
			href={`/conversations/${encodeURIComponent(
				conversation.id
			)}/${encodeURIComponent(conversation.slug)}`}
		>
			<span className="shrink-0 flex flex-col items-center pt-1">
				<span
					className={cx(
						'leading-4 px-2 py-1.5 bg-opacity-10 rounded-lg transition-colors ease-linear',
						conversation.upvoted === true
							? 'text-sky-500 bg-sky-500'
							: 'text-white bg-white',
						!canUpdatePoints && 'text-opacity-50 bg-opacity-5'
					)}
					aria-label={`${conversation.upvotes}`}
					data-balloon-pos="right"
					onClick={upvote}
				>
					<FontAwesomeIcon icon={faArrowUp} />
				</span>
				<span className="font-bold">{conversation.points}</span>
				<span
					className={cx(
						'leading-4 px-2 py-1.5 bg-opacity-10 rounded-lg transition-colors ease-linear',
						conversation.upvoted === false
							? 'text-orange-500 bg-orange-500'
							: 'text-white bg-white',
						!canUpdatePoints && 'text-opacity-50 bg-opacity-5'
					)}
					aria-label={`${conversation.downvotes}`}
					data-balloon-pos="right"
					onClick={downvote}
				>
					<FontAwesomeIcon icon={faArrowDown} />
				</span>
			</span>
			<span className="grow-[1] flex flex-col items-stretch gap-2">
				<span className="text-xl font-bold line-clamp-3 group-hover:underline">
					{conversation.title}
				</span>
				<span className="flex flex-col items-stretch gap-1">
					<span className="flex items-center gap-2 font-bold text-white text-opacity-50">
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
					</span>
					<span className="font-bold text-white text-opacity-50">
						{conversation.views} view{conversation.views === 1 ? '' : 's'} •{' '}
						{conversation.comments} comment
						{conversation.comments === 1 ? '' : 's'} •{' '}
						{formatDate(conversation.created)}
					</span>
				</span>
				{conversation.text && (
					<span className="line-clamp-4">{mdToText(conversation.text)}</span>
				)}
			</span>
		</Link>
	)
}

export default ConversationRow
