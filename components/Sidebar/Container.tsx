'use client'

import {
	ReactNode,
	useCallback,
	useLayoutEffect,
	useRef,
	useState
} from 'react'
import { createPortal } from 'react-dom'
import cx from 'classnames'

import CollapsedContainer from './CollapsedContainer'

const SidebarContainer = ({
	className,
	children
}: {
	className?: string
	children?: ReactNode
}) => {
	const [isExpanded, setIsExpanded] = useState(true)

	const onMediaQueryChange = useCallback(
		({ matches }: MediaQueryListEvent) => {
			setIsExpanded(matches)
		},
		[setIsExpanded]
	)

	useLayoutEffect(() => {
		const mediaQuery = window.matchMedia('(min-width: 1000px)')

		onMediaQueryChange(
			new MediaQueryListEvent('change', { matches: mediaQuery.matches })
		)

		mediaQuery.addEventListener('change', onMediaQueryChange)

		return () => {
			mediaQuery.removeEventListener('change', onMediaQueryChange)
		}
	}, [onMediaQueryChange])

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
