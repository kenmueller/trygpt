'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'

import { ConversationWithUserAndChatData } from '@/lib/conversation'
import mdToText from '@/lib/md/toText'
import defaultUserImage from '@/assets/user.png'
import formatDate from '@/lib/date/format'

const ConversationRow = ({
	conversation
}: {
	conversation: ConversationWithUserAndChatData
}) => {
	return (
		<Link
			className="group flex items-start gap-4 px-4 py-3 bg-white bg-opacity-5 rounded-xl"
			href={`/conversations/${encodeURIComponent(
				conversation.id
			)}/${encodeURIComponent(conversation.slug)}`}
		>
			<span className="shrink-0 flex flex-col items-center pt-1">
				<span
					className="leading-4"
					aria-label={`${conversation.upvotes}`}
					data-balloon-pos="right"
				>
					<FontAwesomeIcon icon={faArrowUp} />
				</span>
				<span className="font-bold">{conversation.points}</span>
				<span
					className="leading-4"
					aria-label={`${conversation.downvotes}`}
					data-balloon-pos="right"
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
