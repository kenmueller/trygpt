'use client'

import { ReactNode, useCallback } from 'react'
import Link from 'next/link'
import cx from 'classnames'

import SignInButton from '@/components/SignInButton'
import { logEvent } from '@/lib/analytics/lazy'

const onNavHomeClick = () => {
	logEvent('click_nav_home')
}

const LandingPageNav = () => (
	<nav className="flex flex-col items-stretch gap-4 max-w-[1000px] w-[95%] mx-auto py-4">
		<div className="flex justify-between items-center">
			<Link
				className="transition-opacity ease-linear hover:opacity-70 text-2xl font-bold"
				href="/"
				onClick={onNavHomeClick}
			>
				TryGPT
			</Link>
			<NavLinks className="hidden min-[520px]:flex" />
			<SignInButton
				className="flex justify-center items-center w-28 h-10 font-bold bg-white bg-opacity-10 rounded-full transition-colors ease-linear hover:bg-opacity-20"
				iconClassName="shrink-0 mr-2 text-xl"
			/>
		</div>
		<NavLinks className="min-[520px]:hidden" />
	</nav>
)

const NavLinks = ({ className }: { className?: string }) => (
	<div
		className={cx(
			'self-center flex items-center gap-4 min-[570px]:gap-8',
			className
		)}
	>
		<NavLink href="#pricing">Pricing</NavLink>
		<NavLink href="#features">Features</NavLink>
		<NavLink href="/conversations">Conversations</NavLink>
	</div>
)

const NavLink = ({ href, children }: { href: string; children: ReactNode }) => {
	const onClick = useCallback(() => {
		logEvent('nav_link_clicked', { href })
	}, [href])

	const props = {
		className: 'transition-opacity ease-linear hover:opacity-70',
		href,
		onClick,
		children
	}

	return href.startsWith('#') ? <a {...props} /> : <Link {...props} />
}

export default LandingPageNav
