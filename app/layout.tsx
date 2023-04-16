import { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import cx from 'classnames'

import userFromRequest from '@/lib/user/fromRequest'
import UpdateUser from '@/components/UpdateUser'
import BASE_METADATA from '@/lib/metadata/base'
import FontAwesomeConfig from '@/components/FontAwesomeConfig'

import '@fortawesome/fontawesome-svg-core/styles.css'
import './layout.scss'

const inter = Inter({
	subsets: ['latin'],
	weight: ['400', '700', '900'],
	fallback: [
		'system-ui',
		'-apple-system',
		'BlinkMacSystemFont',
		'Segoe UI',
		'Roboto',
		'Oxygen',
		'Ubuntu',
		'Cantarell',
		'Open Sans',
		'Helvetica Neue',
		'sans-serif'
	]
})

const sfMono = localFont({
	variable: '--font-sf-mono',
	src: '../assets/SFMono-Regular.otf',
	weight: '400',
	fallback: ['Consolas', 'Liberation Mono', 'Menlo', 'Courier', 'monospace']
})

export const metadata = BASE_METADATA

const RootLayout = async ({ children }: { children: ReactNode }) => {
	const user = await userFromRequest()

	return (
		<html lang="en" dir="ltr">
			<body className={cx(inter.className, sfMono.variable)}>
				{children}
				<UpdateUser user={user} />
				<FontAwesomeConfig />
			</body>
		</html>
	)
}

export default RootLayout
