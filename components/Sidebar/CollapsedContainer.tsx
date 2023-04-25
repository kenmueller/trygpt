'use client'

import { MouseEvent, ReactNode, useCallback, useRef } from 'react'
import { useRecoilState } from 'recoil'
import cx from 'classnames'

import isSidebarShowingState from '@/lib/atoms/isSidebarShowing'

const CollapsedSidebarContainer = ({
	className,
	children
}: {
	className?: string
	children?: ReactNode
}) => {
	const [isSidebarShowing, setIsSidebarShowing] = useRecoilState(
		isSidebarShowingState
	)

	const sidebar = useRef<HTMLDivElement | null>(null)

	const onRootClick = useCallback(
		({ target }: MouseEvent<HTMLDivElement>) => {
			if (
				!sidebar.current ||
				sidebar.current === target ||
				sidebar.current.contains(target as Node)
			)
				return

			setIsSidebarShowing(false)
		},
		[setIsSidebarShowing, sidebar]
	)

	return (
		<div
			className={cx(
				'fixed inset-0 bg-opacity-50 z-10 transition-colors duration-300 ease-linear',
				isSidebarShowing ? 'bg-black' : 'pointer-events-none bg-transparent'
			)}
			onClick={onRootClick}
		>
			<aside
				ref={sidebar}
				className={cx(
					'absolute inset-y-0 transition-left duration-300 ease-linear',
					isSidebarShowing ? 'left-0' : '-left-full',
					className
				)}
			>
				{children}
			</aside>
		</div>
	)
}

export default CollapsedSidebarContainer
