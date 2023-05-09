if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
	throw new Error('Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID')
if (!process.env.NEXT_PUBLIC_DISQUS_SHORTNAME)
	throw new Error('Missing NEXT_PUBLIC_DISQUS_SHORTNAME')

const { getCSP, SELF, UNSAFE_INLINE, UNSAFE_EVAL, DATA } = require('csp-header')
const withPlugins = require('next-compose-plugins')
const { default: withPwa } = require('@ducanh2912/next-pwa')
const withBundleAnalyzer = require('@next/bundle-analyzer')
const { IgnorePlugin } = require('webpack')

const DEV = process.env.NODE_ENV === 'development'

const UNSPlASH_SOURCES = ['source.unsplash.com', 'images.unsplash.com']

const csp = getCSP({
	directives: {
		'base-uri': [SELF],
		'default-src': [SELF],
		'style-src': [SELF, UNSAFE_INLINE, 'c.disquscdn.com'],
		'script-src': [
			SELF,
			DATA,
			UNSAFE_INLINE,
			...(DEV ? [UNSAFE_EVAL] : []),
			'apis.google.com',
			'www.googletagmanager.com',
			`${process.env.NEXT_PUBLIC_DISQUS_SHORTNAME}.disqus.com`,
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
			`${process.env.NEXT_PUBLIC_DISQUS_SHORTNAME}.disqus.com`,
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
			`${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
			'disqus.com'
		]
	}
})

/** @type {import('next').NextConfig} */
const config = {
	swcMinify: true,
	experimental: {
		serverActions: true
	},
	images: {
		domains: [
			'storage.googleapis.com',
			'lh1.googleusercontent.com',
			'lh2.googleusercontent.com',
			'lh3.googleusercontent.com',
			'lh4.googleusercontent.com',
			'lh5.googleusercontent.com',
			'lh6.googleusercontent.com'
		]
	},
	headers: async () => [
		{
			source: '/:path*',
			headers: [{ key: 'content-security-policy', value: csp }]
		}
	],
	webpack: config => {
		config.plugins.push(new IgnorePlugin({ resourceRegExp: /^pg-native$/ }))
		return config
	}
}

module.exports = withPlugins(
	[
		withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' }),
		withPwa({ disable: DEV, dest: 'public' })
	],
	config
)
