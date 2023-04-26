'use client'

import { useCallback, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone } from '@fortawesome/free-solid-svg-icons'

const ChatInputSpeechButton = ({
	disabled,
	submit
}: {
	disabled: boolean
	submit: (prompt: string) => void
}) => {
	const startSpeech = useCallback(() => {}, [])

	return (
		<button onClick={startSpeech} aria-label="Speak your messages">
			<FontAwesomeIcon icon={faMicrophone} />
		</button>
	)
}

export default ChatInputSpeechButton
