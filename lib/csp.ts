if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
	throw new Error('Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID')
if (!process.env.NEXT_PUBLIC_DISQUS_SHORTNAME)
	throw new Error('Missing NEXT_PUBLIC_DISQUS_SHORTNAME')

import {
	getCSP,
	SELF,
	UNSAFE_INLINE,
	UNSAFE_EVAL,
	DATA,
	nonce
} from 'csp-header'

import DEV from './dev'

const UNSPlASH_SOURCES = ['source.unsplash.com', 'images.unsplash.com']

const csp = (nonceKey: string) =>
	getCSP({
		directives: {
			'base-uri': [SELF],
			'default-src': [SELF],
			'style-src': [SELF, UNSAFE_INLINE, 'c.disquscdn.com'],
			'script-src': [
				SELF,
				DATA,
				nonce(nonceKey),
				...(DEV ? [UNSAFE_EVAL] : []),
				'apis.google.com',
				'www.googletagmanager.com',
				`${process.env.NEXT_PUBLIC_DISQUS_SHORTNAME!}.disqus.com`,
				'c.disquscdn.com',
				'launchpad-wrapper.privacymanager.io',
				'launchpad.privacymanager.io'
			],
			'connect-src': [
				SELF,
				DATA,
				'apis.google.com',
				'identitytoolkit.googleapis.com',
				'securetoken.googleapis.com',
				'firebase.googleapis.com',
				'firebaseinstallations.googleapis.com',
				'www.googletagmanager.com',
				'*.google-analytics.com',
				...UNSPlASH_SOURCES,
				`${process.env.NEXT_PUBLIC_DISQUS_SHORTNAME!}.disqus.com`,
				'referrer.disqus.com',
				'c.disquscdn.com',
				'launchpad-wrapper.privacymanager.io',
				'launchpad.privacymanager.io',
				'links.services.disqus.com',
				'cdn.viglink.com',
				'geo.privacymanager.io',
				'realtime.services.disqus.com'
			],
			'img-src': [
				SELF,
				DATA,
				...UNSPlASH_SOURCES,
				'cdn.viglink.com',
				'referrer.disqus.com',
				'c.disquscdn.com'
			],
			'frame-src': [
				SELF,
				`${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!}.firebaseapp.com`,
				'disqus.com'
			]
		}
	})

export default csp
