'use client'

import { useCallback } from 'react'
import Image from 'next/image'
import { useSetRecoilState } from 'recoil'
import cx from 'classnames'

import ImageCompletion from '@/lib/image'
import imageCompletionUrlFromId from '@/lib/image/urlFromId'
import ThreeDotsLoader from '@/components/ThreeDotsLoader'
import DeleteButton from './DeleteButton'
import imagesState from '@/lib/atoms/images'
import ShareButton from './ShareButton'
import DownloadButton from './DownloadButton'

const ImageMessage = ({ image }: { image: ImageCompletion }) => {
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
		<article
			className={cx(
				'message flex gap-2 min-[700px]:gap-4 relative px-2 min-[700px]:px-4 py-4 even:bg-white even:bg-opacity-10',
				image.error && 'bg-red-500 bg-opacity-100'
			)}
		>
			<div className="grow-[1] flex flex-col items-start gap-3">
				<p>{image.prompt}</p>
				{image.loading && <ThreeDotsLoader />}
				{!(image.loading || image.error) && image.expanded && (
					<Image
						className="rounded-2xl"
						src={imageCompletionUrlFromId(image.id)}
						alt={image.prompt}
						width={1024}
						height={1024}
						quality={100}
						priority
					/>
				)}
				{!(image.loading || image.error) && (
					<button
						className="font-bold underline transition-opacity ease-linear hover:opacity-70"
						onClick={toggleExpanded}
					>
						{!image.expanded ? 'View' : 'Hide'} Image
					</button>
				)}
			</div>
			{!image.error && (
				<div className="shrink-0 flex flex-col items-center gap-1">
					<ShareButton image={image} />
					<DownloadButton image={image} />
					<DeleteButton image={image} />
				</div>
			)}
		</article>
	)
}

export default ImageMessage
