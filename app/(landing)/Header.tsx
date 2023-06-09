import Image from 'next/image'

import SignInButton from '@/components/SignInButton'
import chatImage from '@/assets/chat.png'

const LandingPageHeader = () => (
	<header className="max-w-[1000px] w-[95%] mx-auto pt-4 pb-8">
		<h1 className="text-center text-4xl min-[450px]:text-5xl font-black [&_strong]:text-[#24e098]">
			ChatGPT <strong>4</strong> for <strong>$1</strong>
		</h1>
		<p className="mt-4 text-center">
			TryGPT is a <strong>pay-as-you-go</strong> service for{' '}
			<strong>ChatGPT 4</strong>. Try ChatGPT 3.5 for <strong>free</strong>,
			then buy ChatGPT 4 for <strong>$1</strong>.
		</p>
		<Image
			className="w-full h-auto mt-8 bg-zinc-800 rounded-2xl shadow-lg"
			src={chatImage}
			alt="Chat"
			priority
		/>
		<SignInButton
			className="flex justify-center items-center w-40 h-14 mt-8 mx-auto text-2xl font-bold bg-white bg-opacity-10 rounded-full transition-colors ease-linear hover:bg-opacity-20"
			iconClassName="shrink-0 mr-3"
		/>
	</header>
)

export default LandingPageHeader
