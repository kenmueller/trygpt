import pageMetadata from '@/lib/metadata/page'
import userFromRequest from '@/lib/user/fromRequest'
import NewChatInput from '@/components/ChatInput/New'
import Nav from '@/components/Dashboard/Nav'
import NewChatPageInfo from '@/components/NewChatPage/Info'

export const generateMetadata = () =>
	pageMetadata({
		title: 'New Chat | TryGPT',
		description:
			'Start a new chat. TryGPT is the cheapest way to get access to GPT-4 which is far, far superior to the free GPT-3.5. Start now for only $1.',
		previewTitle: 'New Chat'
	})

const NewChatPage = async () => {
	const user = await userFromRequest()
	if (!user) return null

	return (
		<>
			<Nav canCreateChat={false}>New Chat</Nav>
			<main className="grid grid-rows-[1fr_auto] gap-4 overflow-y-auto">
				<div className="flex flex-col overflow-y-auto">
					<NewChatPageInfo className="flex flex-col items-center m-auto text-center" />
				</div>
				<NewChatInput />
			</main>
		</>
	)
}

export default NewChatPage
