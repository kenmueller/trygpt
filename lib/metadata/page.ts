import { Metadata } from 'next'

import getUrl from '@/lib/getUrl'

export interface PageMetadataBaseOptions {
	title: string
	description: string
}

export type PageMetadataOptions = PageMetadataBaseOptions &
	({ previewTitle: string } | { previewImage: string })

const pageMetadata = (options: PageMetadataOptions): Metadata => {
	const fullUrl = getUrl()
	const url = new URL(fullUrl.pathname, fullUrl.origin).href

	const image =
		'previewTitle' in options
			? `/api/preview?title=${encodeURIComponent(options.previewTitle)}`
			: options.previewImage

	return {
		alternates: { canonical: url },
		title: options.title,
		description: options.description,
		openGraph: {
			type: 'website',
			title: options.title,
			description: options.description,
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
			title: options.title,
			description: options.description,
			images: image
		}
	}
}

export default pageMetadata
