'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { useRecoilValue } from 'recoil'

import chatMessagesState from '@/lib/atoms/chatMessages'

const ChatMessagesContainer = ({
	className,
	children
}: {
	className?: string
	children?: ReactNode
}) => {
	const messages = useRecoilValue(chatMessagesState)

	const root = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		if (!(messages && root.current)) return
		root.current.scrollTop = root.current.scrollHeight
	}, [messages, root])

	return (
		<div ref={root} className={className}>
			{children}
		</div>
	)
}

export default ChatMessagesContainer
