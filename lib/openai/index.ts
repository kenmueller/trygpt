import 'server-only'

if (!process.env.OPENAI_API_KEY) throw new Error('Missing OPENAI_API_KEY')

import { Configuration, OpenAIApi } from 'openai'

const config = new Configuration({
	apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(config)

export default openai
