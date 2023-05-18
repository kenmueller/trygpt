'use client'

import { useCallback } from 'react'
import { useSetRecoilState } from 'recoil'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

import ImageCompletion from '@/lib/image'
import imagesState from '@/lib/atoms/images'
import alertError from '@/lib/error/alert'
import errorFromUnknown from '@/lib/error/fromUnknown'
import errorFromResponse from '@/lib/error/fromResponse'

const ImageCompletionDeleteButton = ({ image }: { image: ImageCompletion }) => {
	const setImages = useSetRecoilState(imagesState)

	const deleteImage = useCallback(async () => {
		try {
			if (!confirm('Are you sure you want to delete this image?')) return

			setImages(
				images =>
					images && images.filter(otherImage => otherImage.id !== image.id)
			)

			const response = await fetch(
				`/api/images/${encodeURIComponent(image.id)}`,
				{ method: 'DELETE' }
			)

			if (!response.ok) throw await errorFromResponse(response)
		} catch (unknownError) {
			alertError(errorFromUnknown(unknownError))
		}
	}, [image.id, setImages])

	return (
		<button
			className="text-red-500 transition-colors ease-linear hover:text-opacity-70"
			disabled={image.loading}
			onClick={deleteImage}
		>
			<FontAwesomeIcon icon={faTrash} />
		</button>
	)
}

export default ImageCompletionDeleteButton
