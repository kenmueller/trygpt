import 'server-only'

if (!process.env.NEXT_PUBLIC_ORIGIN)
	throw new Error('Missing NEXT_PUBLIC_ORIGIN')

import { Metadata } from 'next'

const pageMetadata = ({
	path,
	title,
	description,
	previewTitle
}: {
	path: string
	title: string
	description: string
	previewTitle: string
}): Metadata => {
	const url = `${process.env.NEXT_PUBLIC_ORIGIN!}${path}`
	const image = `${process.env
		.NEXT_PUBLIC_ORIGIN!}/api/preview?title=${encodeURIComponent(previewTitle)}`

	return {
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
			images: image,
			countryName: 'United States'
		},
		twitter: {
			card: 'summary_large_image',
			site: '@trygpt',
			creator: '@trygpt',
			title,
			description,
			images: image
		}
	}
}

export default pageMetadata
