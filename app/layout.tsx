if (!process.env.NEXT_PUBLIC_ORIGIN)
	throw new Error('Missing NEXT_PUBLIC_ORIGIN')

import { ReactNode } from 'react'
import { Inter } from 'next/font/google'

import favicon from '@/assets/favicon.png'

import './layout.scss'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
	applicationName: 'TryGPT',
	authors: [{ name: 'Ken Mueller', url: process.env.NEXT_PUBLIC_ORIGIN }],
	publisher: 'TryGPT',
	creator: 'Ken Mueller',
	themeColor: 'white',
	manifest: '/manifest.webmanifest',
	icons: favicon.src
}

const RootLayout = ({ children }: { children: ReactNode }) => (
	<html lang="en" dir="ltr">
		<body className={inter.className}>{children}</body>
	</html>
)

export default RootLayout
