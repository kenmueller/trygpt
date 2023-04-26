'use client'

import { RefObject, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboard } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'
import copy from 'copy-to-clipboard'

const ChatMessageCopyButton = ({
	className,
	content
}: {
	className?: string
	content: RefObject<HTMLDivElement | null>
}) => {
	const onClick = useCallback(() => {
		copy(content.current?.textContent ?? '')
		alert('Copied to clipboard')
	}, [content])

	return (
		<button
			className={cx(
				'transition-opacity ease-linear hover:opacity-70',
				className
			)}
			aria-label="Copy message to clipboard"
			onClick={onClick}
		>
			<FontAwesomeIcon className="text-xl" icon={faClipboard} />
		</button>
	)
}

export default ChatMessageCopyButton
