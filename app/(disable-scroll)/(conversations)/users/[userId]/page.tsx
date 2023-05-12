import { Suspense } from 'react'
import { notFound } from 'next/navigation'

import formatDate from '@/lib/date/format'
import pageMetadata from '@/lib/metadata/page'
import ThreeDotsLoader from '@/components/ThreeDotsLoader'
import SetUserPageState from './SetState'
import Info from './Info'
import Conversations from './Conversations'
import Await from '@/components/Await'
import userFromRequest from '@/lib/user/fromRequest'
import publicUserFromId from '@/lib/user/publicFromId'
import conversationsFromUserId from '@/lib/conversation/fromUserId'

export const generateMetadata = async ({
	params: { userId: encodedPublicUserId }
}: {
	params: { userId: string }
}) => {
	const publicUserId = decodeURIComponent(encodedPublicUserId)

	const publicUser = await publicUserFromId(publicUserId)
	if (!publicUser) return {}

	return pageMetadata({
		title: `${publicUser.name} (${publicUser.points}) | Users | TryGPT`,
		description: `View ${
			publicUser.name
		}'s profile on TryGPT. ${publicUser} has ${publicUser.points} point${
			publicUser.points === 1 ? '' : 's'
		} and created their account on ${formatDate(publicUser.created)}.`,
		previewTitle: `${publicUser.name} (${publicUser.points})`
	})
}

const UserPage = async ({
	params: { userId: encodedPublicUserId }
}: {
	params: { userId: string }
}) => {
	const publicUserId = decodeURIComponent(encodedPublicUserId)

	const user = await userFromRequest()

	const publicUser = await publicUserFromId(publicUserId)
	if (!publicUser) notFound()

	const conversations = conversationsFromUserId(publicUser.id, user)

	return (
		<main className="flex flex-col items-center py-4 overflow-y-auto scroll-smooth">
			<SetUserPageState publicUser={publicUser} conversations={conversations} />
			<div className="flex flex-col items-stretch gap-4 max-w-[1500px] w-[95%]">
				<Info />
				<h2>Conversations</h2>
				<Suspense fallback={<ThreeDotsLoader className="mx-auto mt-4" />}>
					{/* @ts-expect-error */}
					<Await promise={conversations}>
						<Conversations />
					</Await>
				</Suspense>
			</div>
		</main>
	)
}

export default UserPage
