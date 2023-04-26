import { Converter } from 'showdown'
import katex from 'katex'

import highlight from 'showdown-highlight'

const replaceMath = (text: string, match: RegExp, displayMode: boolean) =>
	text.replace(match, (_substring, math) =>
		katex.renderToString(math, { displayMode })
	)

const converter = new Converter({
	extensions: [highlight()]
})

converter.setOption('literalMidWordUnderscores', true)
converter.setOption('literalMidWordAsterisks', true)
converter.setOption('tables', true)

const mdToHtml = (md: string) => {
	md = replaceMath(md, /\\\[(.*?)\\\]/gs, true)
	md = replaceMath(md, /\\\((.*?)\\\)/gs, false)

	return converter.makeHtml(md)
}

export default mdToHtml
