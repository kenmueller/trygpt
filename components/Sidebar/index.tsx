import { Suspense } from 'react'

import Await from '@/components/Await'
import Chat from '@/lib/chat'
import NewChatLink from './NewChatLink'
import Chats from './Chats'
import Settings from './Settings'

const Sidebar = ({
	chats: chatsPromise
}: {
	chats: Promise<Chat[]> | null
}) => (
	<aside>
		<div>
			{chatsPromise && (
				<>
					<NewChatLink />
					<Suspense fallback={<p>Loading...</p>}>
						{/* @ts-expect-error */}
						<Await promise={chatsPromise}>
							<Chats />
						</Await>
					</Suspense>
				</>
			)}
		</div>
		<Settings />
	</aside>
)

export default Sidebar
