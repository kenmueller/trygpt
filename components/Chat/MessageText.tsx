import ChatMessage from '@/lib/chat/message'

const ChatMessageText = ({ message }: { message: ChatMessage }) => (
	<article
		style={{
			background: message.error ? 'red' : message.loading ? 'blue' : undefined
		}}
	>
		<p>{message.role}</p>
		<p>{message.text}</p>
	</article>
)

export default ChatMessageText
