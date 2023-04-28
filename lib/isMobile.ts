import { headers } from 'next/headers'

const userAgents = [
	/Android/i,
	/webOS/i,
	/iPhone/i,
	/iPad/i,
	/iPod/i,
	/BlackBerry/i,
	/Windows Phone/i
]

const isMobile = () => {
	const userAgent = headers().get('user-agent')
	if (!userAgent) return false

	return userAgents.some(match => match.test(userAgent))
}

export default isMobile
