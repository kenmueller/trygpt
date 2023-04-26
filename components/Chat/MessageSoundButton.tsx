'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeHigh } from '@fortawesome/free-solid-svg-icons'

import ChatMessage from '@/lib/chat/message'
import alertError from '@/lib/error/alert'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'

const ChatMessageSoundButton = ({
	className,
	message
}: {
	className?: string
	message: ChatMessage
}) => {
	const [isPlaying, setIsPlaying] = useState(false)

	const playSound = useCallback(
		() => {
			if (!('speechSynthesis' in window))
				return alertError(
					new HttpError(
						ErrorCode.BadRequest,
						'Text-to-speech is not supported in your browser'
					)
				)

			setIsPlaying(true)

			// const utterance = new SpeechSynthesisUtterance(message.text)

			// utterance.addEventListener('end', () => {
			// 	setIsPlaying(false)
			// })

			// speechSynthesis.speak(utterance)
		},
		[
			/* message, setIsPlaying */
		]
	)

	const previousText = useRef<string | null>(null)

	useEffect(() => {
		// artyom.current ??= new Artyom()
		// const newText = previousText.current
		// 	? message.text.replace(previousText.current, '')
		// 	: message.text
		// previousText.current = message.text
		// artyom.current.say(newText)
	}, [message.text, previousText])

	return (
		<button
			className={cx('', className)}
			disabled={isPlaying}
			aria-label="Hear message out loud"
			onClick={playSound}
		>
			<FontAwesomeIcon icon={faVolumeHigh} />
		</button>
	)
}

export default ChatMessageSoundButton
