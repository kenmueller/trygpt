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
		themeColor: 'black',
		manifest: '/manifest.webmanifest',
		icons: favicon.src
	}
}

export default baseMetadata
