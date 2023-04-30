import { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import cx from 'classnames'

import getIsMobile from '@/lib/isMobile'
import userFromRequest from '@/lib/user/fromRequest'
import SetRootLayoutState from '@/components/RootLayout/SetState'
import baseMetadata from '@/lib/metadata/base'
import FontAwesomeConfig from '@/components/FontAwesomeConfig'
import RecoilRoot from '@/components/Recoil/Root'
import ToastContainer from '@/components/Toast/Container'
import PaymentAlert from '@/components/PaymentAlert'
import ScreenView from '@/components/ScreenView'

import 'balloon-css/balloon.css'
import 'react-toastify/dist/ReactToastify.css'
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

export const dynamic = 'force-dynamic'

export const generateMetadata = () => baseMetadata()

const RootLayout = async ({ children }: { children: ReactNode }) => {
	const isMobile = getIsMobile()
	const user = await userFromRequest()

	return (
		<html lang="en" dir="ltr" className="h-full scroll-smooth">
			<body
				className={cx(
					inter.className,
					sfMono.variable,
					'h-full scroll-smooth text-white bg-zinc-800'
				)}
			>
				<RecoilRoot>
					<SetRootLayoutState isMobile={isMobile} user={user} />
					{children}
					<PaymentAlert />
					<ScreenView />
					<ToastContainer theme="dark" />
					<FontAwesomeConfig />
				</RecoilRoot>
			</body>
		</html>
	)
}

export default RootLayout
