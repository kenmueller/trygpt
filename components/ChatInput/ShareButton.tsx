'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShareSquare } from '@fortawesome/free-solid-svg-icons'
import copy from 'copy-to-clipboard'

const share = () => {
	copy(window.location.href)
	alert('Chat link copied to clipboard')
}

const ChatInputShareButton = () => (
	<button
		className="pl-1 text-2xl text-sky-500 transition-opacity ease-linear hover:opacity-70"
		aria-label="Copy chat link to clipboard"
		onClick={share}
	>
		<FontAwesomeIcon icon={faShareSquare} />
	</button>
)

export default ChatInputShareButton
