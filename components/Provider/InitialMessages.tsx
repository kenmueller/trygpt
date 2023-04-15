'use client'

import { ReactNode, useState } from 'react'

import InitialMessagesContext, {
	InitialMessage
} from '@/lib/context/initialMessages'

const InitialMessagesProvider = ({ children }: { children: ReactNode }) => {
	const initialMessagesState = useState<InitialMessage[] | null>(null)

	return (
		<InitialMessagesContext.Provider value={initialMessagesState}>
			{children}
		</InitialMessagesContext.Provider>
	)
}

export default InitialMessagesProvider
