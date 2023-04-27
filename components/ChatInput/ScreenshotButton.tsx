'use client'

import { useCallback } from 'react'
import { useRecoilValue } from 'recoil'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'

import alertError from '@/lib/error/alert'
import errorFromUnknown from '@/lib/error/fromUnknown'
import Chat from '@/lib/chat'
import chatMessagesContainerRef from '@/lib/atoms/chatMessagesContainer'

const ChatInputSpeechButton = ({ chat }: { chat: Chat }) => {
	const chatMessagesContainer = useRecoilValue(chatMessagesContainerRef)

	const captureImage = useCallback(async () => {
		try {
			const container = chatMessagesContainer.current
			if (!container) throw new Error('No messages container')

			const saveAsPromise = import('file-saver').then(module => module.default)
			const domToImage = await import('dom-to-image').then(
				module => module.default
			)

			container.classList.add('chat-messages-container-screenshot')

			const [saveAs, url] = await Promise.all([
				saveAsPromise,
				domToImage.toJpeg(container, { cacheBust: true })
			])

			container.classList.remove('chat-messages-container-screenshot')

			saveAs(url, `${chat.name}.jpg`)
		} catch (unknownError) {
			alertError(errorFromUnknown(unknownError))
		}
	}, [chat.name, chatMessagesContainer])

	return (
		<button
			className="text-2xl text-sky-500 transition-opacity ease-linear hover:opacity-70"
			aria-label="Capture a full-size screenshot"
			onClick={captureImage}
		>
			<FontAwesomeIcon icon={faImage} />
		</button>
	)
}

export default ChatInputSpeechButton
