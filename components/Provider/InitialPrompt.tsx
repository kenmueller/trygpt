'use client'

import { ReactNode, useState } from 'react'

import InitialPromptContext from '@/lib/context/initialPrompt'

const InitialPromptProvider = ({
	initialValue,
	children
}: {
	initialValue: string | null
	children: ReactNode
}) => {
	const initialPromptState = useState(initialValue)

	return (
		<InitialPromptContext.Provider value={initialPromptState}>
			{children}
		</InitialPromptContext.Provider>
	)
}

export default InitialPromptProvider
