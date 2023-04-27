'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShareSquare } from '@fortawesome/free-solid-svg-icons'
import copy from 'copy-to-clipboard'
import { toast } from 'react-toastify'

const share = () => {
	copy(window.location.href)
	toast.success('Chat link copied to clipboard')
}

const ChatInputShareButton = () => (
	<button
		className="pl-1 text-xl w-450:text-2xl text-sky-500 transition-opacity ease-linear hover:opacity-70"
		aria-label="Copy chat link to clipboard"
		onClick={share}
	>
		<FontAwesomeIcon icon={faShareSquare} />
	</button>
)

export default ChatInputShareButton
