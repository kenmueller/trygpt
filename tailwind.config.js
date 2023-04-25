const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}'
	],
	theme: {
		screens: {
			xxs: '380px',
			xs: '450px',
			...defaultTheme.screens
		},
		extend: {}
	},
	plugins: []
}
