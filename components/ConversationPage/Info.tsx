'use client'

import { useRecoilValue } from 'recoil'

import conversationState from '@/lib/atoms/conversation'
import formatDate from '@/lib/date/format'
import Markdown from '@/components/Markdown'

const ConversationPageInfo = () => {
	const conversation = useRecoilValue(conversationState)
	if (!conversation) throw new Error('Conversation not found')

	return (
		<>
			<div className="flex flex-col items-stretch gap-2">
				<h1>{conversation.title}</h1>
				<p className="font-bold text-white text-opacity-50">
					{conversation.points} point{conversation.points === 1 ? '' : 's'} •{' '}
					{conversation.views} view{conversation.views === 1 ? '' : 's'} •{' '}
					<a className="hover:underline" href="#comments">
						{conversation.comments} comment
						{conversation.comments === 1 ? '' : 's'}
					</a>{' '}
					• {formatDate(conversation.created)}
				</p>
			</div>
			{conversation.text && <Markdown text={conversation.text} />}
		</>
	)
}

export default ConversationPageInfo
