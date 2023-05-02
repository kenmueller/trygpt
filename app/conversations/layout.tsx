import { ReactNode } from 'react'

import pageMetadata from '@/lib/metadata/page'
import Nav from '@/components/Conversations/Nav'

export const generateMetadata = () =>
	pageMetadata({
		title: 'Conversations | TryGPT',
		description: 'TryGPT Conversations',
		previewTitle: 'Conversations'
	})

const ConversationsLayout = async ({ children }: { children: ReactNode }) => (
	<>
		<Nav />
		{children}
	</>
)

export default ConversationsLayout
