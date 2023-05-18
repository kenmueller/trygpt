'use client'

import { useEffect, useRef } from 'react'
import { useRecoilValue } from 'recoil'

import imageState from '@/lib/atoms/image'
import ImageMessage from './Image'

const ImagePageImages = () => {
	const image = useRecoilValue(imageState)
	if (!image) throw new Error('Missing image')

	const root = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		if (!(image && root.current)) return
		root.current.scrollTop = root.current.scrollHeight
	}, [image, root])

	return (
		<div ref={root} className="flex flex-col overflow-y-auto">
			<ImageMessage image={image} />
		</div>
	)
}

export default ImagePageImages
