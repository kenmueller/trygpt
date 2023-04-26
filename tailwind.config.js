/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./app/**/*.{js,ts,jsx,tsx,mdx,css,scss}',
		'./components/**/*.{js,ts,jsx,tsx,mdx,css,scss}'
	],
	theme: {
		screens: {
			'w-380': '380px',
			'w-450': '450px',
			'w-700': '700px',
			'w-1000': '1000px',
			'w-1500': '1500px'
		},
		extend: {
			transitionProperty: {
				left: 'left'
			}
		}
	},
	plugins: []
}
