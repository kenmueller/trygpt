'use client'

import { HTMLProps, useContext, useEffect, useRef } from 'react'

import ChatMessagesContext from '@/lib/context/chatMessages'

const ChatMessagesContainer = (props: HTMLProps<HTMLDivElement>) => {
	const [messages] = useContext(ChatMessagesContext)

	const root = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		if (!(messages && root.current)) return
		root.current.scrollTop = root.current.scrollHeight
	}, [messages, root])

	return <div {...props} ref={root} />
}

export default ChatMessagesContainer
