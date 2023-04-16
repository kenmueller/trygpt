'use client'

import { useCallback, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'

import styles from './ExtraButton.module.scss'

const ChatInputSpeechButton = () => {
	const captureImage = useCallback(() => {}, [])

	return (
		<button
			className={styles.root}
			onClick={captureImage}
			aria-label="Capture a full-size screenshot"
			data-balloon-pos="up-left"
		>
			<FontAwesomeIcon icon={faImage} />
		</button>
	)
}

export default ChatInputSpeechButton
