import { Metadata } from 'next'

import favicon from '@/assets/favicon.png'
import ORIGIN from '@/lib/origin'

const baseMetadata: Metadata = {
	metadataBase: ORIGIN,
	applicationName: 'TryGPT',
	authors: [{ name: 'Ken Mueller', url: ORIGIN }],
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

export default baseMetadata
