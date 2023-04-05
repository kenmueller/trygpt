import { Converter } from 'showdown'

// @ts-expect-error
import htmlEscape from 'showdown-htmlescape'
import highlight from 'showdown-highlight'

const converter = new Converter({
	extensions: [htmlEscape, highlight()]
})

const mdToHtml = (md: string) => converter.makeHtml(md)

export default mdToHtml
