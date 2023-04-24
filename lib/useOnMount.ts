import { useRef } from 'react'

const useOnMount = (effect: () => void) => {
	const didMount = useRef(false)

	if (!didMount.current) {
		didMount.current = true
		effect()
	}
}

export default useOnMount
