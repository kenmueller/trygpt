import ChatMessage from '@/lib/chat/message'

const ChatMessageText = ({ message }: { message: ChatMessage }) => (
	<article>
		<p>{message.role}</p>
		<p>{message.text}</p>
	</article>
)

export default ChatMessageText
