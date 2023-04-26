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
				'fixed inset-0 bg-opacity-50 z-10 transition-colors duration-200',
				isSidebarShowing ? 'bg-black' : 'pointer-events-none bg-transparent'
			)}
			aria-hidden={isSidebarShowing ? undefined : true}
			onClick={onRootClick}
		>
			<aside
				ref={sidebar}
				className={cx(
					'absolute left-0 inset-y-0 transition-transform duration-200',
					!isSidebarShowing && '-translate-x-full',
					className
				)}
			>
				{children}
			</aside>
		</div>
	)
}

export default CollapsedSidebarContainer
