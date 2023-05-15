import Link from 'next/link'

import userFromRequest from '@/lib/user/fromRequest'
import pageMetadata from '@/lib/metadata/page'
import TweetActionForm from './Form'

export const generateMetadata = () =>
	pageMetadata({
		title: 'Tweet | TryGPT',
		description: 'TryGPT Tweet Action',
		previewTitle: 'Tweet'
	})

const TweetActionPage = async () => {
	const user = await userFromRequest()

	if (!user)
		return (
			<main className="flex flex-col justify-center items-center gap-4 w-[95%] h-full mx-auto py-4 text-center">
				<h1>You must be signed in</h1>
				<Link className="underline" href="/">
					Home
				</Link>
			</main>
		)

	return <TweetActionForm />
}

export default TweetActionPage
