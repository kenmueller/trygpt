import pageMetadata from '@/lib/metadata/page'
import userFromRequest from '@/lib/user/fromRequest'
import Nav from '@/components/Dashboard/Nav'
import SetImagesPageState from './SetState'
import imagesFromUserId from '@/lib/image/fromUserId'
import Images from './Images'
import ImagesInput from './Input'

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

	const images = imagesFromUserId(user.id)

	return (
		<>
			<SetImagesPageState images={images} />
			<Nav>My Images</Nav>
			<main className="grid grid-rows-[1fr_auto] gap-4 overflow-y-auto">
				<Images />
				<ImagesInput />
			</main>
		</>
	)
}

export default ImagesPage
