import { Suspense } from 'react'

import pageMetadata from '@/lib/metadata/page'
import userFromRequest from '@/lib/user/fromRequest'
import Nav from '@/components/Dashboard/Nav'
import SetImagesPageState from './SetState'
import imageCompletionsFromUserId from '@/lib/image/fromUserId'
import Images from './Images'
import ImagesInput from './Input'
import ThreeDotsLoader from '@/components/ThreeDotsLoader'
import Await from '@/components/Await'
import ImagesPageContainer from './Container'
import ImagesPagePurchaseButton from './PurchaseButton'

export const generateMetadata = () =>
	pageMetadata({
		title: 'My Images | TryGPT',
		description:
			'Create a new image using DALL-E 2. TryGPT is the cheapest way to get access to GPT-4 which is far, far superior to the free GPT-3.5. Start now for only $1.',
		previewTitle: 'My Images'
	})

const ImagesPage = async () => {
	const user = await userFromRequest()
	if (!user) return null

	const images = imageCompletionsFromUserId(user.id)

	return (
		<>
			<SetImagesPageState images={images} />
			<Nav>My Images</Nav>
			<ImagesPageContainer>
				<Suspense
					fallback={
						<div className="flex flex-col overflow-y-auto">
							<ThreeDotsLoader className="m-auto" />
						</div>
					}
				>
					{/* @ts-expect-error */}
					<Await promise={images}>
						<Images />
					</Await>
				</Suspense>
				<ImagesPagePurchaseButton />
				<ImagesInput />
			</ImagesPageContainer>
		</>
	)
}

export default ImagesPage
