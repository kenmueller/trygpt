'use client'

import InitialPromptContext from '@/lib/initialPrompt/context'
import { ReactNode, useState } from 'react'

const InitialPromptProvider = ({ children }: { children: ReactNode }) => {
	const initialPromptState = useState<string | null>(null)

	return (
		<InitialPromptContext.Provider value={initialPromptState}>
			{children}
		</InitialPromptContext.Provider>
	)
}

export default InitialPromptProvider
