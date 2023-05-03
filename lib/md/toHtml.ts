import { Converter, ShowdownExtension } from 'showdown'
import katex from 'katex'
import highlight from 'showdown-highlight'

const katexToString = (math: string, displayMode: boolean) =>
	katex.renderToString(math, {
		throwOnError: false,
		errorColor: '#ef4444',
		displayMode
	})

const extension: ShowdownExtension = {
	type: 'lang',
	filter: function (text, _converter, options) {
		const codeBlocks: string[] = []

		const hashCodeBlock = (code: string) =>
			'~C' + (codeBlocks.push(code) - 1) + 'C'

		text += '~0'

		text = text.replace(/(^[ \t]*>([ \t]*>)*)(?=.*?$)/gm, substring =>
			substring.replace(/>/g, '~Q')
		)

		if (options?.ghCodeBlocks ?? true)
			text = text.replace(
				/(^|\n)(```(.*)\n([\s\S]*?)\n```)/g,
				(_substring, m1, m2) => m1 + hashCodeBlock(m2)
			)

		text = text.replace(
			/((?:(?:(?: |\t|~Q)*?~Q)?\n){2}|^(?:(?: |\t|~Q)*?~Q)?)((?:(?:(?: |\t|~Q)*?~Q)?(?:[ ]{4}|\t).*\n+)+)((?:(?: |\t|~Q)*?~Q)?\n*[ ]{0,3}(?![^ \t\n])|(?=(?:(?: |\t|~Q)*?~Q)?~0))/g,
			(_substring, m1, m2, m3) => m1 + hashCodeBlock(m2) + m3
		)

		text = text.replace(/(^|[^\\])((`+)([^\r]*?[^`])\3)(?!`)/gm, substring =>
			hashCodeBlock(substring)
		)

		text = text.replace(/<(\/?(?:script|style))/g, '&lt;$1')

		text = text.replace(/\\\[(.*?)\\\]/gs, (_substring: string, math: string) =>
			katexToString(math, true)
		)

		text = text.replace(/\\\((.*?)\\\)/gs, (_substring: string, math: string) =>
			katexToString(math, false)
		)

		while (text.search(/~C(\d+)C/) >= 0)
			text = text.replace(
				/~C\d+C/,
				// @ts-expect-error
				codeBlocks[RegExp.$1].replace(/\$/g, '$$$$')
			)

		text = text.replace(/~Q/g, '>')
		text = text.replace(/~0$/, '')

		return text
	}
}

const converter = new Converter({
	extensions: [extension, highlight()]
})

converter.setOption('literalMidWordUnderscores', true)
converter.setOption('literalMidWordAsterisks', true)
converter.setOption('tables', true)

const mdToHtml = (md: string) => converter.makeHtml(md)

export default mdToHtml
