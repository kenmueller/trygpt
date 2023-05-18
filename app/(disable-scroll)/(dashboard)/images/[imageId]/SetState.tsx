'use client'

import { useSetRecoilState } from 'recoil'

import useImmediateEffect from '@/lib/useImmediateEffect'
import ImageCompletion from '@/lib/image'
import imageState from '@/lib/atoms/image'

const SetImagePageState = ({ image }: { image: ImageCompletion }) => {
	const setImage = useSetRecoilState(imageState)

	useImmediateEffect(() => {
		setImage(image)
	}, [image, setImage])

	return null
}

export default SetImagePageState
