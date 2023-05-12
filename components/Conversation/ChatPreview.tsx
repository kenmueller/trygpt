import Link from 'next/link'

import ChatMessage from '@/lib/chat/message'
import Message from '@/components/Chat/Message'
import User from '@/lib/user'
import Chat from '@/lib/chat'

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
	title,
	chat,
	user,
	messages,
	continueInNewTab = false
}: {
	title: string
	chat: Pick<Chat, 'id' | 'name'>
	user: Pick<User, 'photo' | 'name'>
	messages: ChatMessage[]
	continueInNewTab?: boolean
}) => (
	<div className="flex flex-col items-stretch gap-4">
		{title && <h3>{chat.name || 'Untitled'}</h3>}
		<div className="border border-white border-opacity-50">
			{messages.map(message => (
				<Message key={message.id} user={user} message={message} />
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
