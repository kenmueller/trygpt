'use client'

import { useRecoilValue } from 'recoil'

import imagesState from '@/lib/atoms/images'
import ImageMessage from './Image'

const Images = () => {
	const images = useRecoilValue(imagesState)
	if (!images) throw new Error('Missing images')

	return (
		<div className="flex flex-col overflow-y-auto">
			{images.map(image => (
				<ImageMessage key={image.id} image={image} />
			))}
		</div>
	)
}

export default Images
