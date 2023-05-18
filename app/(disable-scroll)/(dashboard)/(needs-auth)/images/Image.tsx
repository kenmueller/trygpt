import Image from 'next/image'

import ImageCompletion from '@/lib/image'
import imageCompletionUrlFromId from '@/lib/image/urlFromId'
import ThreeDotsLoader from '@/components/ThreeDotsLoader'
import DeleteButton from './DeleteButton'

const ImageMessage = ({ image }: { image: ImageCompletion }) => (
	<article>
		{JSON.stringify(image, null, 2)}
		{!(image.loading || image.error) && (
			<Image
				src={imageCompletionUrlFromId(image.id)}
				alt={image.prompt}
				width={1024}
				height={1024}
				quality={100}
				priority
			/>
		)}
		<div>
			<DeleteButton image={image} />
			{image.loading && <ThreeDotsLoader />}
		</div>
	</article>
)

export default ImageMessage
