import { useCallback, useLayoutEffect, useState } from 'react'

const useMediaQuery = (query: string, defaultMatches = false) => {
	const [matches, setMatches] = useState(defaultMatches)

	const onMediaQueryChange = useCallback(
		({ matches }: MediaQueryListEvent) => {
			setMatches(matches)
		},
		[setMatches]
	)

	useLayoutEffect(() => {
		const mediaQuery = window.matchMedia(query)

		onMediaQueryChange(
			new MediaQueryListEvent('change', { matches: mediaQuery.matches })
		)

		mediaQuery.addEventListener('change', onMediaQueryChange)

		return () => {
			mediaQuery.removeEventListener('change', onMediaQueryChange)
		}
	}, [query, onMediaQueryChange])

	return matches
}

export default useMediaQuery
