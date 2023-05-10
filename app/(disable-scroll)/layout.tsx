import { ReactNode } from 'react'

import DisableScroll from '@/components/DisableScroll'

const DisableScrollLayout = ({ children }: { children: ReactNode }) => (
	<>
		{children}
		<DisableScroll />
	</>
)

export default DisableScrollLayout
