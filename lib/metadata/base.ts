import 'server-only'

if (!process.env.NEXT_PUBLIC_ORIGIN)
	throw new Error('Missing NEXT_PUBLIC_ORIGIN')

import { Metadata } from 'next'

import favicon from '@/assets/favicon.png'

import theme from '@/styles/theme.module.scss'

const BASE_METADATA: Metadata = {
	applicationName: 'TryGPT',
	authors: [{ name: 'Ken Mueller', url: process.env.NEXT_PUBLIC_ORIGIN }],
	publisher: 'TryGPT',
	creator: 'Ken Mueller',
	themeColor: theme.dark,
	manifest: '/manifest.webmanifest',
	icons: favicon.src
}

export default BASE_METADATA
