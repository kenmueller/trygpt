'use client'

import { ReactNode, useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import cx from 'classnames'

import chatMessagesState from '@/lib/atoms/chatMessages'
import chatMessagesContainerRef from '@/lib/atoms/chatMessagesContainer'

import './MessagesContainer.scss'

const ChatMessagesContainer = ({
	className,
	children
}: {
	className?: string
	children?: ReactNode
}) => {
	const chatMessagesContainer = useRecoilValue(chatMessagesContainerRef)
	const messages = useRecoilValue(chatMessagesState)

	useEffect(() => {
		const container = chatMessagesContainer.current
		if (!(messages && container)) return

		container.scrollTop = container.scrollHeight
	}, [messages, chatMessagesContainer])

	return (
		<div ref={chatMessagesContainer} className={cx('bg-zinc-800', className)}>
			{children}
		</div>
	)
}

export default ChatMessagesContainer
