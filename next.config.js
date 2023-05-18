const withPlugins = require('next-compose-plugins')
const { default: withPwa } = require('@ducanh2912/next-pwa')
const withBundleAnalyzer = require('@next/bundle-analyzer')
const { IgnorePlugin } = require('webpack')

const DEV = process.env.NODE_ENV === 'development'

/** @type {import('next').NextConfig} */
const config = {
	swcMinify: true,
	experimental: {
		serverActions: true
	},
	images: {
		domains: [
			'storage.googleapis.com',
			'firebasestorage.googleapis.com',
			'lh1.googleusercontent.com',
			'lh2.googleusercontent.com',
			'lh3.googleusercontent.com',
			'lh4.googleusercontent.com',
			'lh5.googleusercontent.com',
			'lh6.googleusercontent.com'
		]
	},
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
