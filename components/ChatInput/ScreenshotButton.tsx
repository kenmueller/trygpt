'use client'

import { useCallback, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'

import alertError from '@/lib/error/alert'
import errorFromUnknown from '@/lib/error/fromUnknown'
import Chat from '@/lib/chat'
import chatMessagesContainerRef from '@/lib/atoms/chatMessagesContainer'
import { logEvent } from '@/lib/analytics/lazy'

const saveImage = async (container: HTMLDivElement, filename: string) => {
	const saveAsPromise = import('file-saver').then(module => module.default)
	const domToImage = await import('dom-to-image').then(module => module.default)

	container.classList.add('chat-messages-container-screenshot')

	const [saveAs, url] = await Promise.all([
		saveAsPromise,
		domToImage.toJpeg(container, { cacheBust: true })
	])

	container.classList.remove('chat-messages-container-screenshot')

	saveAs(url, `${filename}.jpg`)
}

const ChatInputScreenshotButton = ({ chat }: { chat: Chat }) => {
	const chatMessagesContainer = useRecoilValue(chatMessagesContainerRef)

	const [isLoading, setIsLoading] = useState(false)

	const captureImage = useCallback(async () => {
		try {
			const container = chatMessagesContainer.current
			if (!container) throw new Error('No messages container')

			setIsLoading(true)

			logEvent('chat_screenshot')

			await toast.promise(saveImage(container, chat.name ?? 'Untitled'), {
				pending: 'Generating chat image...',
				success: 'Generated chat image',
				error: 'Failed to generate chat image'
			})
		} catch (unknownError) {
			alertError(errorFromUnknown(unknownError))
		} finally {
			setIsLoading(false)
		}
	}, [chat.name, chatMessagesContainer, setIsLoading])

	return (
		<button
			className="text-xl w-450:text-2xl text-sky-500 transition-colors ease-linear hover:text-opacity-70 disabled:text-opacity-50"
			aria-label="Capture a full-size screenshot"
			data-balloon-pos="up-left"
			disabled={isLoading}
			onClick={captureImage}
		>
			<FontAwesomeIcon icon={faImage} />
		</button>
	)
}

export default ChatInputScreenshotButton
