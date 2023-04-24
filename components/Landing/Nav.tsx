import { ReactNode } from 'react'
import Link from 'next/link'

import SignInButton from '@/components/SignInButton'

const LandingPageNav = () => (
	<nav className="flex justify-between items-center max-w-[1000px] w-[95%] mx-auto py-4">
		<Link
			className="transition-opacity ease-linear hover:opacity-70 text-2xl font-bold"
			href="/"
		>
			TryGPT
		</Link>
		<div className="flex items-center gap-8">
			<NavLink href="#pricing">Pricing</NavLink>
			<NavLink href="#features">Features</NavLink>
		</div>
		<SignInButton
			className="flex justify-center items-center w-28 h-10 font-bold bg-white bg-opacity-10 rounded-full transition-colors ease-linear hover:bg-opacity-20"
			iconClassName="shrink-0 mr-2 text-xl"
		/>
	</nav>
)

const NavLink = ({ href, children }: { href: string; children: ReactNode }) => (
	<a className="transition-opacity ease-linear hover:opacity-70" href={href}>
		{children}
	</a>
)

export default LandingPageNav
