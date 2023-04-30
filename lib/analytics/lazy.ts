export const setUserId: typeof import('.').setUserId = (...args) => {
	import('./index')
		.then(({ setUserId }) => setUserId(...args))
		.catch(console.error)
}

export const logEvent: typeof import('.').logEvent = (...args) => {
	import('./index')
		.then(({ logEvent }) => logEvent(...args))
		.catch(console.error)
}
