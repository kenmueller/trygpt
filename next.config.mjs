import withPlugins from 'next-compose-plugins'
import withPwa from '@ducanh2912/next-pwa'
import withBundleAnalyzer from '@next/bundle-analyzer'
import webpack from 'webpack'

const { IgnorePlugin } = webpack

const DEV = process.env.NODE_ENV === 'development'

/** @type {import('next').NextConfig} */
const config = {
	swcMinify: true,
	experimental: {
		serverActions: true
	},
	images: {
		formats: ['image/avif', 'image/webp'],
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

export default withPlugins(
	[
		withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' }),
		withPwa({ disable: DEV, dest: 'public' })
	],
	config
)
