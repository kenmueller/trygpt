'use client'

import { ReactNode, useState } from 'react'

import InitialPromptContext from '@/lib/context/initialPrompt'

const InitialPromptProvider = ({ children }: { children: ReactNode }) => {
	const initialPromptState = useState<string | null>(null)

	return (
		<InitialPromptContext.Provider value={initialPromptState}>
			{children}
		</InitialPromptContext.Provider>
	)
}

export default InitialPromptProvider
