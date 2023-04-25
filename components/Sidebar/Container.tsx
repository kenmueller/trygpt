'use client'

import {
	ReactNode,
	useCallback,
	useLayoutEffect,
	useRef,
	useState
} from 'react'
import { createPortal } from 'react-dom'

import CollapsedContainer from './CollapsedContainer'

const SidebarContainer = ({
	className,
	children
}: {
	className?: string
	children?: ReactNode
}) => {
	const mediaQuery = useRef<MediaQueryList | null>(null)
	const [isExpanded, setIsExpanded] = useState(false)

	const onMediaQueryChange = useCallback(
		({ matches }: MediaQueryListEvent) => {
			setIsExpanded(matches)
		},
		[setIsExpanded]
	)

	useLayoutEffect(() => {
		if (!mediaQuery.current)
			mediaQuery.current = window.matchMedia('(min-width: 1000px)')

		onMediaQueryChange(
			new MediaQueryListEvent('change', { matches: mediaQuery.current.matches })
		)

		mediaQuery.current.addEventListener('change', onMediaQueryChange)

		return () => {
			mediaQuery.current?.removeEventListener('change', onMediaQueryChange)
		}
	}, [mediaQuery, onMediaQueryChange])

	return isExpanded ? (
		<aside className={className}>{children}</aside>
	) : (
		createPortal(
			<CollapsedContainer className={className}>{children}</CollapsedContainer>,
			document.body
		)
	)
}

export default SidebarContainer
