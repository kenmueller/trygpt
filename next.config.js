const { join } = require('path')
const { IgnorePlugin } = require('webpack')

/** @type {import('next').NextConfig} */
const config = {
	reactStrictMode: true,
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
	sassOptions: {
		includePaths: [join(__dirname, 'styles')]
	},
	webpack: config => {
		config.plugins.push(new IgnorePlugin({ resourceRegExp: /^pg-native$/ }))
		return config
	}
}

module.exports = config
