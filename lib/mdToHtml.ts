import { Converter } from 'showdown'
import katex from 'katex'

// @ts-expect-error
import htmlEscape from 'showdown-htmlescape'
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

const mdToHtml = (md: string) => {
	md = replaceMath(md, /\\\[(.*?)\\\]/gs, true)
	md = replaceMath(md, /\\\((.*?)\\\)/gs, false)

	return converter.makeHtml(md)
}

export default mdToHtml
