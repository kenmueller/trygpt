const { join } = require('path')

/** @type {import('next').NextConfig} */
const config = {
	experimental: {
		appDir: true
	},
	sassOptions: {
		includePaths: [join(__dirname, 'styles')]
	}
}

module.exports = config
