'use client'

import { useCallback } from 'react'

import ChatMessage from '@/lib/chat/message'
import alertError from '@/lib/error/alert'
import cx from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeHigh } from '@fortawesome/free-solid-svg-icons'

import styles from './MessageSoundButton.module.scss'

const ChatMessageSoundButton = ({
	className,
	message
}: {
	className?: string
	message: ChatMessage
}) => {
	const playSound = useCallback(() => {
		if (!('speechSynthesis' in window))
			return alertError(
				new Error('Text-to-speech is not supported in your browser')
			)

		const utterance = new SpeechSynthesisUtterance(message.text)
		speechSynthesis.speak(utterance)
	}, [message])

	return (
		<button className={cx(styles.root, className)} onClick={playSound}>
			<FontAwesomeIcon icon={faVolumeHigh} />
		</button>
	)
}

export default ChatMessageSoundButton
