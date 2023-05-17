'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'
import { useCallback } from 'react'
import { useSetRecoilState } from 'recoil'

import isSidebarShowingState from '@/lib/atoms/isSidebarShowing'
import { logEvent } from '@/lib/analytics/lazy'

const SidebarImagesLink = () => {
	const setIsSidebarShowing = useSetRecoilState(isSidebarShowingState)

	const pathname = usePathname()
	const active = pathname === '/images'

	const onClick = useCallback(() => {
		logEvent('click_sidebar_images')
		setIsSidebarShowing(false)
	}, [setIsSidebarShowing])

	return (
		<Link
			className={cx(
				'flex items-center gap-4 px-4 py-2 font-bold transition-colors ease-linear hover:bg-white hover:bg-opacity-10',
				active && 'pointer-events-none bg-white bg-opacity-10'
			)}
			aria-current={active ? 'page' : undefined}
			href="/images"
			onClick={onClick}
		>
			<FontAwesomeIcon className="shrink-0 w-[30px] text-xl" icon={faImage} />
			My Images
		</Link>
	)
}

export default SidebarImagesLink
