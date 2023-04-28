import mdToHtml from './toHtml'

/** Can only be used on the client. */
const mdToText = (md: string) => {
	const element = document.createElement('div')

	element.innerHTML = mdToHtml(md)

	return element.textContent ?? ''
}

export default mdToText
