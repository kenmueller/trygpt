'use client'

import { useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'

import alertError from '@/lib/error/alert'
import errorFromUnknown from '@/lib/error/fromUnknown'

const ChatInputSpeechButton = ({ chatName }: { chatName: string }) => {
	const captureImage = useCallback(
		async () => {
			try {
				// const saveAsPromise = import('file-saver').then(module => module.default)
				// const htmlToImage = await import('html-to-image')
				// const element = document.querySelector<HTMLElement>('.page_main__7pSdt')!
				// const [saveAs, url] = await Promise.all([
				// 	saveAsPromise,
				// 	htmlToImage.toJpeg(element)
				// ])
				// saveAs(url, `${chatName}.jpg`)
				// const canvas = await html2canvas(element, {
				// 	scale: 1
				// })
				// const blob = await new Promise<Blob | null>(resolve => {
				// 	canvas.toBlob(resolve, 'image/jpeg', 0.95)
				// })
				// if (!blob) throw new Error('Failed to capture image')
				// saveAs(blob, `${chatName}.jpg`)
			} catch (unknownError) {
				alertError(errorFromUnknown(unknownError))
			}
		},
		[
			/* chatName */
		]
	)

	return (
		<button onClick={captureImage} aria-label="Capture a full-size screenshot">
			<FontAwesomeIcon icon={faImage} />
		</button>
	)
}

export default ChatInputSpeechButton
