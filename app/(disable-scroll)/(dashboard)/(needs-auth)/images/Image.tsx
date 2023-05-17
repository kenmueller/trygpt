'use client'

import ImageCompletion from '@/lib/image'

const ImageMessage = ({ image }: { image: ImageCompletion }) => {
	return <article>{JSON.stringify(image, null, 2)}</article>
}

export default ImageMessage
