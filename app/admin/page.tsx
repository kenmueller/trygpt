import { Suspense } from 'react'
import Link from 'next/link'

import userFromRequest from '@/lib/user/fromRequest'
import pageMetadata from '@/lib/metadata/page'
import ThreeDotsLoader from '@/components/ThreeDotsLoader'
import AdminInfo from '@/components/AdminPage/Info'

export const generateMetadata = () =>
	pageMetadata({
		title: 'Admin | TryGPT',
		description: 'TryGPT Admin Interface',
		previewTitle: 'Admin'
	})

const AdminPage = async () => {
	const user = await userFromRequest()

	if (!(user && user.admin))
		return (
			<main className="flex flex-col justify-center items-center gap-4 max-w-[1500px] w-[95%] h-full mx-auto py-4 text-center">
				<h1>You must be signed in as an admin</h1>
				<Link className="underline" href="/">
					Home
				</Link>
			</main>
		)

	return (
		<main className="flex flex-col items-stretch gap-4 max-w-[1500px] w-[95%] mx-auto py-4">
			<h1>TryGPT Admin</h1>
			<Suspense fallback={<ThreeDotsLoader className="mx-auto mt-4" />}>
				{/* @ts-expect-error */}
				<AdminInfo />
			</Suspense>
		</main>
	)
}

export default AdminPage
