import { Metadata } from 'next'

import favicon from '@/assets/favicon.png'
import getUrl from '@/lib/getUrl'

const baseMetadata = (): Metadata => {
	const url = getUrl()

	return {
		metadataBase: new URL(url.origin),
		applicationName: 'TryGPT',
		authors: [{ name: 'Ken Mueller', url: url.origin }],
		publisher: 'TryGPT',
		creator: 'Ken Mueller',
		themeColor: '#27272a',
		manifest: '/manifest.webmanifest',
		icons: favicon.src,
		viewport: {
			width: 'device-width',
			initialScale: 1,
			minimumScale: 1,
			maximumScale: 1,
			viewportFit: 'cover',
			userScalable: false
		}
	}
}

export default baseMetadata
