import { Metadata } from 'next'

import getUrl from '@/lib/getUrl'

const pageMetadata = ({
	title,
	description,
	previewTitle
}: {
	title: string
	description: string
	previewTitle: string
}): Metadata => {
	const fullUrl = getUrl()
	const url = new URL(fullUrl.pathname, fullUrl.origin).href

	const image = `/api/preview/${encodeURIComponent(previewTitle)}`

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
