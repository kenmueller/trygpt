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
		className="flex items-stretch min-[1000px]:items-center gap-8 max-w-[1800px] w-[95%] flex-col min-[1000px]:flex-row min-[1000px]:even:flex-row-reverse"
		id={id}
	>
		<article className="grow-[1] basis-0">
			<h2 className="text-2xl min-[1500px]:text-4xl font-extrabold [&_strong]:text-[#24e098] [&_strong.bad]:text-red-500 [&_a]:text-sky-500 [&_a:hover]:underline [&_br]:content-[''] [&_br]:block [&_br]:mt-4">
				{title}
			</h2>
			<p className="mt-8 text-lg min-[1500px]:text-xl">{description}</p>
		</article>
		<Image
			className="grow-[1.5] min-[1500px]:grow-[1] basis-0 w-full min-[1000px]:w-0 h-auto rounded-2xl shadow-lg"
			src={image}
			alt={imageAlt}
		/>
	</section>
)

export default LandingPageSection
