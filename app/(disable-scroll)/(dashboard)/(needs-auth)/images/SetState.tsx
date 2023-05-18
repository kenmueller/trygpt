'use client'

import { useSetRecoilState } from 'recoil'

import useImmediateEffect from '@/lib/useImmediateEffect'
import ImageCompletion from '@/lib/image'
import imagesState from '@/lib/atoms/images'

const SetImagesPageState = ({
	images
}: {
	images: Promise<ImageCompletion[]>
}) => {
	const setImages = useSetRecoilState(imagesState)

	useImmediateEffect(() => {
		setImages(null)

		images.then(images => {
			const expandedImages: ImageCompletion[] = images.map((image, index) =>
				index === images.length - 1 ? { ...image, expanded: true } : image
			)

			setImages(expandedImages)
		})
	}, [images, setImages])

	return null
}

export default SetImagesPageState
