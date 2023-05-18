'use client'

import { useEffect, useRef } from 'react'
import { useRecoilValue } from 'recoil'

import imagesState from '@/lib/atoms/images'
import ImageMessage from './Image'

const Images = () => {
	const images = useRecoilValue(imagesState)
	if (!images) throw new Error('Missing images')

	const root = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		if (!(images && root.current)) return
		root.current.scrollTop = root.current.scrollHeight
	}, [images, root])

	return (
		<div ref={root} className="flex flex-col overflow-y-auto">
			{images.map(image => (
				<ImageMessage key={image.id} image={image} />
			))}
		</div>
	)
}

export default Images
