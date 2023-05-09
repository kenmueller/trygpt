import { MetadataRoute } from 'next'

import maskableImage from '@/assets/maskable.png'

export const dynamic = 'force-dynamic'

const manifest = (): MetadataRoute.Manifest => ({
	dir: 'ltr',
	lang: 'en-US',
	scope: '/',
	start_url: '/',
	name: 'TryGPT',
	short_name: 'TryGPT',
	description: 'TryGPT',
	display: 'standalone',
	theme_color: '#27272a',
	background_color: '#27272a',
	categories: ['games', 'social'],
	icons: [
		{
			src: maskableImage.src,
			sizes: '512x512',
			purpose: 'maskable'
		},
		{
			src: maskableImage.src,
			sizes: '512x512',
			purpose: 'any'
		}
	]
})

export default manifest
