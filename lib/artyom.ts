// @ts-expect-error
import ArtyomConstructor from 'artyom.js'

import sleep from './sleep'
import DEV from './dev'

export interface Artyom {
	recognizingSupported: boolean
	speechSupported: boolean
	addCommands: (
		commands: {
			smart?: boolean
			indexes: string[]
			action: (index: number, message: string) => void
		}[]
	) => void
	fatality: () => void
	initialize: (options: {
		lang: string
		continuous: boolean
		listen: boolean
		debug: boolean
		speed: number
	}) => Promise<void>
	say: (message: string, options?: { onEnd?: () => void }) => string
	shutUp: () => void
}

export const stopArtyom = (artyom: Artyom) => {
	artyom.fatality()
}

export const startArtyom = async (artyom: Artyom) => {
	stopArtyom(artyom)

	await sleep(250)

	await artyom.initialize({
		lang: 'en-US',
		continuous: true,
		listen: true,
		debug: DEV,
		speed: 1
	})
}

export default ArtyomConstructor as { new (): Artyom }
