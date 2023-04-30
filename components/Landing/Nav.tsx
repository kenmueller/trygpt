'use client'

import { ReactNode, useCallback } from 'react'
import Link from 'next/link'

import SignInButton from '@/components/SignInButton'
import { logEvent } from '@/lib/analytics/lazy'

const onNavHomeClick = () => {
	logEvent('click_nav_home')
}

const LandingPageNav = () => (
	<nav className="flex justify-between items-center max-w-[1000px] w-[95%] mx-auto py-4">
		<Link
			className="transition-opacity ease-linear hover:opacity-70 text-2xl font-bold"
			href="/"
			onClick={onNavHomeClick}
		>
			TryGPT
		</Link>
		<div className="flex items-center gap-2 w-380:gap-4 w-450:gap-8">
			<NavLink href="#pricing">Pricing</NavLink>
			<NavLink href="#features">Features</NavLink>
		</div>
		<SignInButton
			className="flex justify-center items-center w-28 h-10 font-bold bg-white bg-opacity-10 rounded-full transition-colors ease-linear hover:bg-opacity-20"
			iconClassName="shrink-0 mr-2 text-xl"
		/>
	</nav>
)

const NavLink = ({ href, children }: { href: string; children: ReactNode }) => {
	const onClick = useCallback(() => {
		logEvent('nav_link_clicked', { href })
	}, [href])

	return (
		<a
			className="transition-opacity ease-linear hover:opacity-70"
			href={href}
			onClick={onClick}
		>
			{children}
		</a>
	)
}

export default LandingPageNav
