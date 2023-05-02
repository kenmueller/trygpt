import pageMetadata from '@/lib/metadata/page'

export const generateMetadata = () =>
	pageMetadata({
		title: 'Conversations | TryGPT',
		description: 'TryGPT Conversations',
		previewTitle: 'Conversations'
	})

const ConversationsPage = async () => {
	return <></>
}

export default ConversationsPage
