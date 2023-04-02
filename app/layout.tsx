import { ReactNode } from 'react'
import { Inter } from 'next/font/google'

import userFromRequest from '@/lib/user/fromRequest'
import UpdateUser from '@/components/UpdateUser'
import BASE_METADATA from '@/lib/metadata/base'

import './layout.scss'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata = BASE_METADATA

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
