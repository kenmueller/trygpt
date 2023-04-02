if (!process.env.NEXT_PUBLIC_ORIGIN)
	throw new Error('Missing NEXT_PUBLIC_ORIGIN')

import preview from '@/assets/preview.jpg'

import styles from './page.module.scss'

const url = process.env.NEXT_PUBLIC_ORIGIN
const title = 'TryGPT'
const description = 'TryGPT'

export const metadata = {
	alternates: { canonical: url },
	title,
	description,
	openGraph: {
		type: 'website',
		title,
		description,
		siteName: 'TryGPT',
		locale: 'en_US',
		url,
		images: preview,
		countryName: 'United States'
	},
	twitter: {
		card: 'summary_large_image',
		site: '@trygpt',
		creator: '@trygpt',
		title,
		description,
		images: preview
	}
}

const Home = () => (
	<main className={styles.root}>
		<h1 className={styles.title}>TryGPT</h1>
	</main>
)

export default Home
