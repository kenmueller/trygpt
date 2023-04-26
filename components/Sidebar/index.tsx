import { Suspense } from 'react'

import Await from '@/components/Await'
import Chat from '@/lib/chat'
import NewChatLink from './NewChatLink'
import Chats from './Chats'
import Settings from './Settings'
import ThreeDotsLoader from '@/components/ThreeDotsLoader'
import SidebarContainer from './Container'
import HomeLink from './HomeLink'

const Sidebar = ({
	chats: chatsPromise
}: {
	chats: Promise<Chat[]> | null
}) => (
	<SidebarContainer className="grid grid-rows-[1fr_auto] w-72 overflow-y-auto bg-[#323235]">
		<div className="py-4 overflow-y-auto">
			{chatsPromise ? (
				<>
					<NewChatLink />
					<Suspense fallback={<ThreeDotsLoader className="mx-auto mt-8" />}>
						{/* @ts-expect-error */}
						<Await promise={chatsPromise}>
							<Chats />
						</Await>
					</Suspense>
				</>
			) : (
				<HomeLink />
			)}
		</div>
		<Settings />
	</SidebarContainer>
)

export default Sidebar
