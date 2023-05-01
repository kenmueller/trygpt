import TitleSection from './TitleSection'
import Section from './Section'
import {
	COST_PER_1000_COMPLETION_TOKENS,
	COST_PER_1000_PROMPT_TOKENS
} from '@/lib/costPerToken'
import formatCents from '@/lib/cents/format'
import startImage from '@/assets/chat.png'
import pricingImage from '@/assets/chat.png'
import shareImage from '@/assets/chat.png'
import screenshotImage from '@/assets/screenshot.jpg'
import textToSpeechImage from '@/assets/chat.png'

const LandingPageSections = () => (
	<main className="flex flex-col items-center gap-8 py-16">
		<TitleSection>
			TryGPT is the <strong>cheapest</strong> way to get access to GPT-4 which
			is far, far superior to the free GPT-3.5.
			<br />
			For example, GPT-4 scores in the <strong>90th percentile</strong> for the
			bar exam and gets a <strong>4 on AP Calc BC</strong>.
			<br />
			GPT-3.5 scores in the <strong className="bad">10th percentile</strong> and
			gets a <strong className="bad">1 on AP Calc BC</strong>. It's also{' '}
			<strong>significantly better at writing essays</strong>.
		</TitleSection>
		<hr className="max-w-[1800px] w-[95%] border-2 border-white border-opacity-20" />
		<Section
			id="pricing"
			title={
				<>
					Try ChatGPT for <strong>free</strong>. If you like it, you can
					purchase the most advanced model (GPT 4) for <strong>$1</strong>.
				</>
			}
			description={
				<>
					A limited number of free messages are available once you sign up. If
					you want more, or you want the most advanced model, you can purchase
					it for <strong>$1</strong>.
				</>
			}
			image={startImage}
			imageAlt="Starting out"
		/>
		<Section
			title={
				<>
					Start out with <strong>$1</strong>.
				</>
			}
			description={
				<>
					Your initial <strong>$1</strong> buys you <strong>7,200</strong>{' '}
					words. That's almost <strong>1 1/2</strong> 5,000-word essays.
				</>
			}
			image={startImage}
			imageAlt="Starting out"
		/>
		<Section
			id="pricing"
			title={
				<>
					ChatGPT 4 normally costs <strong>$20</strong> per month.
					<br />
					You would need to write <strong>215,000</strong> words with TryGPT to
					spend $20. That's <strong>43</strong> 5,000-word essays.
				</>
			}
			description={
				<>
					TryGPT is <strong>much</strong> cheaper than paying the monthly
					subscription for ChatGPT 4. We charge{' '}
					{formatCents(COST_PER_1000_PROMPT_TOKENS)} for 1,000 prompt tokens
					(~750 words) and {formatCents(COST_PER_1000_COMPLETION_TOKENS)} for
					1,000 response tokens (~750 words).
				</>
			}
			image={pricingImage}
			imageAlt="Pricing"
		/>
		<Section
			id="features"
			title={
				<>
					<strong>Share</strong> your chat with anyone. Let them{' '}
					<strong>continue</strong> the conversation.
				</>
			}
			description={
				<>
					Anyone who has the link to your chat can continue the conversation.
					Post the link on social media, send it to a friend, or embed it in
					your website.
				</>
			}
			image={shareImage}
			imageAlt="Share"
		/>
		<Section
			title={
				<>
					Take <strong>full-size screenshots</strong> of the chat to post on{' '}
					<strong>Twitter</strong>.
				</>
			}
			description={
				<>
					With a click of a button, capture the entire chat in a single
					screenshot, <strong>no matter how long it is</strong>.
				</>
			}
			image={screenshotImage}
			imageAlt="Screenshot"
		/>
		<Section
			title={
				<>
					<strong>Talk</strong> to ChatGPT. Let ChatGPT{' '}
					<strong>read back to you</strong>.
				</>
			}
			description={<>Click the microphone icon to start talking to ChatGPT.</>}
			image={textToSpeechImage}
			imageAlt="Text-to-speech"
		/>
	</main>
)

export default LandingPageSections
