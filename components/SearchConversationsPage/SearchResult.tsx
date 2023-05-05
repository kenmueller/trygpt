import Link from 'next/link'
import Image from 'next/image'

import { ConversationWithUserAndChatData } from '@/lib/conversation'
import mdToText from '@/lib/md/toText'
import formatDate from '@/lib/date/format'
import defaultUserImage from '@/assets/user.png'

const SearchConversationsPageSearchResult = ({
	conversation
}: {
	conversation: ConversationWithUserAndChatData
}) => {
	return (
		<Link
			className="group flex flex-col items-stretch gap-2 px-4 py-3 bg-white bg-opacity-5 rounded-xl"
			href={`/conversations/${encodeURIComponent(
				conversation.id
			)}/${encodeURIComponent(conversation.slug)}`}
		>
			<span className="text-xl font-bold line-clamp-3 group-hover:underline">
				{conversation.title}
			</span>
			<span className="flex flex-col items-stretch gap-1">
				<span className="flex items-center gap-2 font-bold text-white text-opacity-50">
					<Image
						className="rounded-lg"
						src={conversation.userPhoto ?? defaultUserImage}
						alt={conversation.userName}
						referrerPolicy={conversation.userPhoto ? 'no-referrer' : undefined}
						width={25}
						height={25}
						priority
					/>
					{conversation.userName}
				</span>
				<span className="font-bold text-white text-opacity-50">
					{formatDate(conversation.created)}
				</span>
			</span>
			{conversation.text && (
				<span className="line-clamp-4">{mdToText(conversation.text)}</span>
			)}
		</Link>
	)
}

export default SearchConversationsPageSearchResult
