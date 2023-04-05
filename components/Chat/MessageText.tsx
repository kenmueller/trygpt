import ChatMessage from '@/lib/chat/message'
import Markdown from '@/components/Markdown'

const ChatMessageText = ({ message }: { message: ChatMessage }) => (
	<article
		style={{
			background: message.error ? 'red' : message.loading ? 'blue' : undefined
		}}
	>
		<p>{message.role}</p>
		<Markdown text={message.text} />
	</article>
)

export default ChatMessageText
