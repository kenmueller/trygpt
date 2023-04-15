import { ReactNode } from 'react'
import Image, { StaticImageData } from 'next/image'

import styles from './Section.module.scss'

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
	<section className={styles.root} id={id}>
		<article className={styles.info}>
			<h2 className={styles.title}>{title}</h2>
			<p className={styles.description}>{description}</p>
		</article>
		<Image className={styles.image} src={image} alt={imageAlt} />
	</section>
)

export default LandingPageSection
