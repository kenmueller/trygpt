'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeHigh } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'
import { logEvent } from 'firebase/analytics'

import ChatMessage from '@/lib/chat/message'
import Artyom from '@/lib/artyom'
import alertError from '@/lib/error/alert'
import errorFromUnknown from '@/lib/error/fromUnknown'
import mdToText from '@/lib/md/toText'
import analytics from '@/lib/analytics'

const ChatMessageSoundButton = ({
	className,
	message
}: {
	className?: string
	message: ChatMessage
}) => {
	const [isStarted, setIsStarted] = useState(false)

	const artyom = useMemo(() => {
		if (typeof window === 'undefined') return null
		return new Artyom()
	}, [])

	const toggleSound = useCallback(() => {
		try {
			if (!artyom) throw new Error('Artyom is not initialized')

			if (!isStarted) {
				if (!artyom.speechSupported)
					throw new Error('Text-to-speech is not supported')

				logEvent(analytics, 'start_playing_message')

				artyom.say(mdToText(message.text), {
					onEnd: () => {
						setIsStarted(false)
					}
				})
			} else {
				logEvent(analytics, 'stop_playing_message')
				artyom.shutUp()
			}

			setIsStarted(isStarted => !isStarted)
		} catch (unknownError) {
			alertError(errorFromUnknown(unknownError))
		}
	}, [message.text, isStarted, setIsStarted, artyom])

	useEffect(() => {
		// On unload stop text-to-speech

		return () => {
			try {
				if (!artyom) throw new Error('Artyom is not initialized')
				artyom.shutUp()
			} catch (unknownError) {
				alertError(errorFromUnknown(unknownError))
			}
		}
	}, [artyom])

	return (
		<button
			className={cx(
				'transition-colors ease-linear hover:text-opacity-70 disabled:opacity-50',
				!isStarted ? 'text-white' : 'text-red-500',
				className
			)}
			aria-label={!isStarted ? 'Speak message out loud' : 'Stop speaking'}
			data-balloon-pos="left"
			disabled={message.loading ?? false}
			onClick={toggleSound}
		>
			<FontAwesomeIcon className="text-xl" icon={faVolumeHigh} />
		</button>
	)
}

export default ChatMessageSoundButton
