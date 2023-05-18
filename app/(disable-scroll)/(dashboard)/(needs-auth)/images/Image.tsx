'use client'

import { useCallback } from 'react'
import { useSetRecoilState } from 'recoil'

import ImageCompletion from '@/lib/image'
import DeleteButton from '@/components/Image/DeleteButton'
import imagesState from '@/lib/atoms/images'
import ShareButton from '@/components/Image/ShareButton'
import DownloadButton from '@/components/Image/DownloadButton'
import ImageMessage from '@/components/Image/Message'

const ImagesPageImageMessage = ({ image }: { image: ImageCompletion }) => {
	const setImages = useSetRecoilState(imagesState)

	const toggleExpanded = useCallback(() => {
		setImages(
			images =>
				images &&
				images.map(otherImage =>
					otherImage.id === image.id
						? { ...otherImage, expanded: !otherImage.expanded || undefined }
						: otherImage
				)
		)
	}, [image.id, setImages])

	return (
		<ImageMessage
			image={image}
			options={
				<>
					<ShareButton image={image} />
					<DownloadButton image={image} />
					<DeleteButton image={image} />
				</>
			}
		>
			<button
				className="font-bold underline transition-opacity ease-linear hover:opacity-70"
				onClick={toggleExpanded}
			>
				{!image.expanded ? 'View' : 'Hide'} Image
			</button>
		</ImageMessage>
	)
}

export default ImagesPageImageMessage
