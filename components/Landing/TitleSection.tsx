import { ReactNode } from 'react'

const LandingPageTitleSection = ({
	id,
	children
}: {
	id?: string
	children: ReactNode
}) => (
	<section className="max-w-[1800px] w-[95%]" id={id}>
		<h2 className="text-center text-2xl min-[1500px]:text-3xl min-[1500px]:leading-10 font-extrabold [&_strong]:text-[#24e098] [&_strong.bad]:text-red-500 [&_br]:content-[''] [&_br]:block [&_br]:mt-4">
			{children}
		</h2>
	</section>
)

export default LandingPageTitleSection
