import { Suspense } from 'react'

import Await from '@/components/Await'
import NewConversationPageForm from './Form'
import SetNewConversationPageState from './SetState'
import ThreeDotsLoader from '@/components/ThreeDotsLoader'
import chatsFromUserId from '@/lib/chat/fromUserId'
import pageMetadata from '@/lib/metadata/page'
import userFromRequest from '@/lib/user/fromRequest'
import ChatSelect from './ChatSelect'

export const generateMetadata = () =>
	pageMetadata({
		title: 'New Conversation | TryGPT',
		description: 'Create a new Conversation on TryGPT',
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
