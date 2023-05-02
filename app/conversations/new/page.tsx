import NewConversationPageForm from '@/components/NewConversationPage/Form'
import pageMetadata from '@/lib/metadata/page'

export const generateMetadata = () =>
	pageMetadata({
		title: 'New Conversation | TryGPT',
		description: 'Create new Conversation on TryGPT',
		previewTitle: 'New Conversation'
	})

const NewConversationPage = () => <NewConversationPageForm />

export default NewConversationPage
