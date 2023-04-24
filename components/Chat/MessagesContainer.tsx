'use client'

import { HTMLProps, useEffect, useRef } from 'react'
import { useRecoilValue } from 'recoil'

import chatMessagesState from '@/lib/atoms/chatMessages'

const ChatMessagesContainer = (props: HTMLProps<HTMLDivElement>) => {
	const messages = useRecoilValue(chatMessagesState)

	const root = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		if (!(messages && root.current)) return
		root.current.scrollTop = root.current.scrollHeight
	}, [messages, root])

	return <div {...props} ref={root} />
}

export default ChatMessagesContainer
