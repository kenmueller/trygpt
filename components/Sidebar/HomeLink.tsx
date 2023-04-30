'use client'

import { faHome } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

import { logEvent } from '@/lib/analytics/lazy'

const onClick = () => {
	logEvent('click_sidebar_home')
}

const SidebarHomeLink = () => (
	<Link
		className="flex items-center gap-4 px-4 py-2 text-xl font-bold transition-colors ease-linear hover:bg-white hover:bg-opacity-10"
		href="/"
		onClick={onClick}
	>
		<FontAwesomeIcon className="shrink-0 w-[30px]" icon={faHome} />
		TryGPT
	</Link>
)

export default SidebarHomeLink
