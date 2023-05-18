import { ReactNode } from 'react'
import Image from 'next/image'
import cx from 'classnames'

import ImageCompletion from '@/lib/image'
import imageCompletionUrlFromId from '@/lib/image/urlFromId'
import ThreeDotsLoader from '@/components/ThreeDotsLoader'

const ImageMessage = ({
	image,
	options,
	children
}: {
	image: ImageCompletion
	options?: ReactNode
	children?: ReactNode
}) => (
	<article
		className={cx(
			'message flex gap-2 min-[700px]:gap-4 relative px-2 min-[700px]:px-4 py-4 even:bg-white even:bg-opacity-10',
			image.error && '!bg-red-500 bg-opacity-100'
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
			{!(image.loading || image.error) && children}
		</div>
		{!image.error && options && (
			<div className="shrink-0 flex flex-col items-center gap-1">{options}</div>
		)}
	</article>
)

export default ImageMessage
