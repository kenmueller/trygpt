import { ReactNode } from 'react'
import Image, { StaticImageData } from 'next/image'

const LandingPageSection = ({
	id,
	title,
	description,
	image,
	imageAlt
}: {
	id?: string
	title: ReactNode
	description?: ReactNode
	image: StaticImageData
	imageAlt: string
}) => (
	<section
		className="flex items-center gap-8 max-w-[1800px] w-[95%] flex-col w-1000:flex-row w-1000:even:flex-row-reverse"
		id={id}
	>
		<article className="grow-[1] basis-0">
			<h2 className="text-2xl w-1500:text-4xl font-extrabold [&_strong]:text-[#24e098] [&_br]:content-[''] [&_br]:block [&_br]:mt-4">
				{title}
			</h2>
			<p className="mt-8 text-lg w-1500:text-xl">{description}</p>
		</article>
		<Image
			className="grow-[1.5] w-1500:grow-[1] basis-0 w-full h-auto rounded-2xl shadow-lg"
			src={image}
			alt={imageAlt}
		/>
	</section>
)

export default LandingPageSection
