import GPT3Tokenizer from 'gpt3-tokenizer'
import ChatMessage from './chat/message'

const tokenizer = new GPT3Tokenizer({ type: 'gpt3' })

const getTokensOfText = (text: string) => tokenizer.encode(text).text.length

const getTokens = (input: string | Pick<ChatMessage, 'text'>[]) =>
	typeof input === 'string'
		? getTokensOfText(input)
		: input.reduce((tokens, { text }) => tokens + getTokensOfText(text), 0)

export default getTokens
