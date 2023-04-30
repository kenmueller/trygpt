export const setUserId: typeof import('.').setUserId = (...args) => {
	import('.').then(({ setUserId }) => setUserId(...args)).catch(console.error)
}

export const logEvent: typeof import('.').logEvent = (...args) => {
	import('.').then(({ logEvent }) => logEvent(...args)).catch(console.error)
}
