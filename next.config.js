if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
	throw new Error('Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID')

const { getCSP, SELF, UNSAFE_INLINE, UNSAFE_EVAL, DATA } = require('csp-header')
const withPlugins = require('next-compose-plugins')
const { default: withPwa } = require('@ducanh2912/next-pwa')
const { IgnorePlugin } = require('webpack')

const DEV = process.env.NODE_ENV === 'development'

const UNSPlASH_SOURCES = ['source.unsplash.com', 'images.unsplash.com']

const csp = getCSP({
	directives: {
		'base-uri': [SELF],
		'default-src': [SELF],
		'style-src': [SELF, UNSAFE_INLINE],
		'script-src': [
			SELF,
			UNSAFE_INLINE,
			...(DEV ? [UNSAFE_EVAL] : []),
			'apis.google.com'
		],
		'connect-src': [
			SELF,
			DATA,
			'identitytoolkit.googleapis.com',
			'securetoken.googleapis.com',
			...UNSPlASH_SOURCES
		],
		'img-src': [SELF, DATA, ...UNSPlASH_SOURCES],
		'frame-src': [
			SELF,
			`${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`
		]
	}
})

/** @type {import('next').NextConfig} */
const config = {
	swcMinify: true,
	experimental: {
		appDir: true
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
	[withPwa({ disable: DEV, dest: 'public' })],
	config
)
