if (!process.env.NEXT_PUBLIC_ORIGIN)
	throw new Error('Missing NEXT_PUBLIC_ORIGIN')

import { ReactNode } from 'react'
import { Inter } from 'next/font/google'

import userFromRequest from '@/lib/user/fromRequest'
import UpdateUser from '@/components/UpdateUser'
import favicon from '@/assets/favicon.png'

import './layout.scss'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata = {
	applicationName: 'TryGPT',
	authors: [{ name: 'Ken Mueller', url: process.env.NEXT_PUBLIC_ORIGIN }],
	publisher: 'TryGPT',
	creator: 'Ken Mueller',
	themeColor: 'white',
	manifest: '/manifest.webmanifest',
	icons: favicon.src
}

const RootLayout = async ({ children }: { children: ReactNode }) => {
	const user = await userFromRequest()

	return (
		<html lang="en" dir="ltr">
			<body className={inter.className}>
				{children}
				<UpdateUser user={user} />
			</body>
		</html>
	)
}

export default RootLayout
