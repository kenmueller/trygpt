import { Converter, ShowdownExtension } from 'showdown'
import katex from 'katex'
import highlight from 'showdown-highlight'

const katexToString = (math: string, displayMode: boolean) =>
	katex.renderToString(math, {
		throwOnError: false,
		errorColor: '#ef4444',
		displayMode
	})

const katexDisplay: ShowdownExtension = {
	type: 'lang',
	regex: /\\\[(.*?)\\\]/gs,
	replace: (_substring: string, math: string) => katexToString(math, true)
}

const katexInline: ShowdownExtension = {
	type: 'lang',
	regex: /\\\((.*?)\\\)/gs,
	replace: (_substring: string, math: string) => katexToString(math, false)
}

const converter = new Converter({
	extensions: [katexDisplay, katexInline, highlight()]
})

converter.setOption('literalMidWordUnderscores', true)
converter.setOption('literalMidWordAsterisks', true)
converter.setOption('tables', true)

const mdToHtml = (md: string) => converter.makeHtml(md)

export default mdToHtml
