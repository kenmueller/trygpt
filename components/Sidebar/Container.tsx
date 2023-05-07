'use client'

import { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import cx from 'classnames'

import CollapsedContainer from './CollapsedContainer'
import useMediaQuery from '@/lib/useMediaQuery'

const SidebarContainer = ({
	className,
	children
}: {
	className?: string
	children?: ReactNode
}) => {
	const isExpanded = useMediaQuery('(min-width: 1000px)', true)

	return isExpanded ? (
		<aside className={cx('hidden w-1000:grid', className)}>{children}</aside>
	) : (
		createPortal(
			<CollapsedContainer className={className}>{children}</CollapsedContainer>,
			document.body
		)
	)
}

export default SidebarContainer
