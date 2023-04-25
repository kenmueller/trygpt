'use client'

import { ReactNode, useCallback } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faPlus } from '@fortawesome/free-solid-svg-icons'
import { useSetRecoilState } from 'recoil'

import isSidebarShowingState from '@/lib/atoms/isSidebarShowing'

const DashboardNav = ({
	canCreateChat = true,
	children
}: {
	canCreateChat?: boolean
	children: ReactNode
}) => {
	const setIsSidebarShowing = useSetRecoilState(isSidebarShowingState)

	const showSidebar = useCallback(() => {
		setIsSidebarShowing(true)
	}, [setIsSidebarShowing])

	return (
		<nav className="flex justify-between items-center w-screen w-1000:hidden">
			<button className="shrink-0 px-4 py-2 text-xl" onClick={showSidebar}>
				<FontAwesomeIcon icon={faBars} />
			</button>
			<h1 className="mx-4 whitespace-nowrap overflow-hidden overflow-ellipsis">
				{children}
			</h1>
			{canCreateChat ? (
				<Link className="shrink-0 px-4 py-2 text-xl" href="/chats/new">
					<FontAwesomeIcon icon={faPlus} />
				</Link>
			) : (
				<span className="shrink-0 px-4 py-2 w-[17.5px]" aria-hidden />
			)}
		</nav>
	)
}

export default DashboardNav
