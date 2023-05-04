import { stripHtml } from 'string-strip-html'

import mdToHtml from './toHtml'

const mdToText = (md: string) =>
	stripHtml(mdToHtml(md, { renderMath: false })).result

export default mdToText
