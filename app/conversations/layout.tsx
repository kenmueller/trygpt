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
	<div className="grid grid-rows-[auto_1fr] h-full overflow-y-auto">
		<Nav />
		<main className="overflow-y-auto">{children}</main>
	</div>
)

export default ConversationsLayout
