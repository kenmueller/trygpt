const { join } = require('path')
const { IgnorePlugin } = require('webpack')

/** @type {import('next').NextConfig} */
const config = {
	experimental: {
		appDir: true
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
