import pageMetadata from '@/lib/metadata/page'
import userFromRequest from '@/lib/user/fromRequest'
import BuyLink from '@/components/BuyLink'
import NewChatInput from '@/components/ChatInput/New'
import Nav from '@/components/Dashboard/Nav'

export const generateMetadata = () =>
	pageMetadata({
		title: 'New Chat | TryGPT',
		description: 'New Chat | TryGPT',
		previewTitle: 'New Chat'
	})

const NewChatPage = async () => {
	const user = await userFromRequest()
	if (!user) return null

	return (
		<>
			<Nav canCreateChat={false}>New Chat</Nav>
			<main className="grid grid-rows-[1fr_auto] overflow-y-auto">
				<div className="flex flex-col overflow-y-auto">
					<div className="flex flex-col items-center m-auto">
						<h1 className="text-4xl font-black">New Chat</h1>
						<p className="mt-1 font-bold opacity-50">GPT 4</p>
						{!user.purchasedAmount && (
							<BuyLink className="flex flex-col justify-center items-center w-60 h-10 mt-6 font-bold bg-sky-500 rounded-lg transition-opacity ease-linear hover:opacity-70" />
						)}
					</div>
				</div>
				<NewChatInput user={user} />
			</main>
		</>
	)
}

export default NewChatPage
