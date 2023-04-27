'use client'

import { useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboard } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'
import copy from 'copy-to-clipboard'
import { toast } from 'react-toastify'

import ChatMessage from '@/lib/chat/message'

const ChatMessageCopyButton = ({
	className,
	message
}: {
	className?: string
	message: ChatMessage
}) => {
	const onClick = useCallback(() => {
		copy(message.text)
		toast.success('Copied to clipboard')
	}, [message.text])

	return (
		<button
			className={cx(
				'text-white transition-colors ease-linear hover:text-opacity-70',
				className
			)}
			aria-label="Copy message to clipboard"
			data-balloon-pos="left"
			onClick={onClick}
		>
			<FontAwesomeIcon className="text-xl" icon={faClipboard} />
		</button>
	)
}

export default ChatMessageCopyButton
