'use client'

import { useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'

import ImageCompletion from '@/lib/image'
import alertError from '@/lib/error/alert'
import errorFromUnknown from '@/lib/error/fromUnknown'
import imageCompletionUrlFromId from '@/lib/image/urlFromId'

const ImageCompletionDownloadButton = ({
	image
}: {
	image: ImageCompletion
}) => {
	const downloadImage = useCallback(async () => {
		try {
			const { default: saveAs } = await import('file-saver')
			saveAs(imageCompletionUrlFromId(image.id), `${image.prompt}.png`)
		} catch (unknownError) {
			alertError(errorFromUnknown(unknownError))
		}
	}, [image.id, image.prompt])

	return (
		<button
			className="text-white transition-colors ease-linear hover:text-opacity-70"
			aria-label="Download image"
			data-balloon-pos="left"
			disabled={image.loading}
			onClick={downloadImage}
		>
			<FontAwesomeIcon icon={faDownload} />
		</button>
	)
}

export default ImageCompletionDownloadButton
