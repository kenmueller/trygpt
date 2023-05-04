import { headers } from 'next/headers'
import _isBot from 'isbot'

const isBot = () => {
	const userAgent = headers().get('user-agent')
	if (!userAgent) return false

	return _isBot(userAgent)
}

export default isBot
