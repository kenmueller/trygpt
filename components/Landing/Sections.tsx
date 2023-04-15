import Section from './Section'
import {
	COST_PER_1000_COMPLETION_TOKENS,
	COST_PER_1000_PROMPT_TOKENS
} from '@/lib/costPerToken'
import startImage from '@/assets/chat.png'
import pricingImage from '@/assets/chat.png'
import shareImage from '@/assets/chat.png'
import textToSpeechImage from '@/assets/chat.png'

import styles from './Sections.module.scss'

const LandingPageSections = () => (
	<main className={styles.root}>
		<Section
			id="pricing"
			title={
				<>
					Start out with <strong>$1</strong>.
				</>
			}
			description={
				<>
					<strong>$1</strong> buys you <strong>11,000</strong> words. That's
					over <strong>two</strong> 5,000-word essays. Start your school year
					off with the help of ChatGPT 4, the most advanced AI to help with your
					homework.
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
					TryGPT is <strong>much</strong> cheaper than normal ChatGPT 4. We
					charge ${COST_PER_1000_PROMPT_TOKENS / 100} for 1,000 prompt tokens
					(~750 words) and ${COST_PER_1000_COMPLETION_TOKENS / 100} for 1,000
					response tokens (~750 words).
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
			image={shareImage}
			imageAlt="Share"
		/>
		<Section
			title={
				<>
					Let ChatGPT <strong>read to you</strong> with sound.
				</>
			}
			description={
				<>Click the sound icon to hear ChatGPT read the responses to you.</>
			}
			image={textToSpeechImage}
			imageAlt="Text-to-speech"
		/>
	</main>
)

export default LandingPageSections
