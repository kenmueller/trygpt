'use client'

import { useCallback } from 'react'
import { toast } from 'react-toastify'
import copy from 'copy-to-clipboard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShareSquare } from '@fortawesome/free-solid-svg-icons'

import ImageCompletion from '@/lib/image'
import ORIGIN from '@/lib/origin'

const ImageCompletionShareButton = ({ image }: { image: ImageCompletion }) => {
	const shareImage = useCallback(() => {
		copy(new URL(`/images/${encodeURIComponent(image.id)}`, ORIGIN).href)
		toast.success('Copied image URL to clipboard')
	}, [image.id])

	return (
		<button
			className="text-white transition-colors ease-linear hover:text-opacity-70"
			aria-label="Share image"
			data-balloon-pos="left"
			disabled={image.loading}
			onClick={shareImage}
		>
			<FontAwesomeIcon icon={faShareSquare} />
		</button>
	)
}

export default ImageCompletionShareButton
