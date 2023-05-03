import Link from 'next/link'

import { ChatWithUserData } from '@/lib/chat'
import ChatMessage from '@/lib/chat/message'
import Message from '@/components/Chat/Message'

const LinkWithNewTab = ({
	className,
	href,
	newTab
}: {
	className?: string
	href: string
	newTab: boolean
}) =>
	newTab ? (
		<a className={className} href={href} target="_blank">
			Continue this chat
		</a>
	) : (
		<Link className={className} href={href}>
			Continue this chat
		</Link>
	)

const ConversationChatPreview = ({
	chat,
	messages,
	continueInNewTab = false
}: {
	chat: ChatWithUserData
	messages: ChatMessage[]
	continueInNewTab?: boolean
}) => (
	<div className="flex flex-col items-stretch gap-4">
		<h3 className="">{chat.name}</h3>
		<div className="max-h-[1100px] overflow-y-auto border border-white border-opacity-50">
			{messages.map(message => (
				<Message key={message.id} chat={chat} message={message} />
			))}
		</div>
		<LinkWithNewTab
			className="self-center px-4 py-2 font-bold bg-sky-500 rounded-lg transition-opacity ease-linear hover:opacity-70"
			href={`/chats/${encodeURIComponent(chat.id)}`}
			newTab={continueInNewTab}
		/>
	</div>
)

export default ConversationChatPreview
