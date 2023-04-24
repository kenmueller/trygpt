import { ReactNode } from 'react'
import Image from 'next/image'

import SignInButton from '@/components/SignInButton'
import chatImage from '@/assets/chat.png'

const LandingPageHeader = () => (
	<header className="max-w-[1000px] w-[95%] mx-auto pt-4 pb-8">
		<h1 className="text-center text-5xl font-black [&_strong]:text-[#24e098]">
			ChatGPT <strong>4</strong> for <strong>$1</strong>
		</h1>
		<p className="mt-4 text-center">
			TryGPT is a pay-as-you-go service for ChatGPT 4. Start now for only $1.
		</p>
		<Image
			className="w-full h-auto mt-8 bg-zinc-800 rounded-2xl shadow-lg"
			src={chatImage}
			alt="Chat"
			priority
		/>
		<SignInButton
			className="flex items-center mt-8 mx-auto px-5 py-3 text-2xl font-bold bg-white bg-opacity-10 rounded-full transition-colors duration-300 ease-linear hover:bg-opacity-20"
			iconClassName="shrink-0 mr-3"
		/>
	</header>
)

export default LandingPageHeader
