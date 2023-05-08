import { Suspense } from 'react'

import Await from '@/components/Await'
import NewConversationPageForm from '@/components/NewConversationPage/Form'
import SetNewConversationPageState from '@/components/NewConversationPage/SetState'
import ThreeDotsLoader from '@/components/ThreeDotsLoader'
import chatsFromUserId from '@/lib/chat/fromUserId'
import pageMetadata from '@/lib/metadata/page'
import userFromRequest from '@/lib/user/fromRequest'
import ChatSelect from '@/components/NewConversationPage/ChatSelect'

export const generateMetadata = () =>
	pageMetadata({
		title: 'New Conversation | TryGPT',
		description: 'Create new Conversation on TryGPT',
		previewTitle: 'New Conversation'
	})

const NewConversationPage = async ({
	searchParams: { chat: encodedSelectedChatId }
}: {
	searchParams: { chat?: string }
}) => {
	const selectedChatId = encodedSelectedChatId
		? decodeURIComponent(encodedSelectedChatId)
		: null

	const user = await userFromRequest()
	const chats = user && chatsFromUserId(user.id)

	return (
		<>
			<SetNewConversationPageState
				chats={chats}
				selectedChatId={selectedChatId}
			/>
			<NewConversationPageForm>
				{chats ? (
					<Suspense fallback={<ThreeDotsLoader className="mx-auto mt-1" />}>
						{/* @ts-expect-error */}
						<Await promise={chats}>
							<ChatSelect />
						</Await>
					</Suspense>
				) : (
					<p className="font-bold text-red-500">
						You must be signed in to select a chat
					</p>
				)}
			</NewConversationPageForm>
		</>
	)
}

export default NewConversationPage
