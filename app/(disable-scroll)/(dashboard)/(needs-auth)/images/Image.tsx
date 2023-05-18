'use client'

import Image from 'next/image'

import ImageCompletion from '@/lib/image'
import imageCompletionUrlFromId from '@/lib/image/urlFromId'

const ImageMessage = ({ image }: { image: ImageCompletion }) => {
	return (
		<>
			<article>{JSON.stringify(image, null, 2)}</article>
			{!(image.loading || image.error) && (
				<article>
					<Image
						src={imageCompletionUrlFromId(image.id)}
						alt={image.prompt}
						width={1024}
						height={1024}
						quality={100}
						priority
					/>
				</article>
			)}
		</>
	)
}

export default ImageMessage
