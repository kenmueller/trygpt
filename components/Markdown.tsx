import { ForwardedRef, forwardRef } from 'react'
import cx from 'classnames'

import mdToHtml from '@/lib/mdToHtml'

import 'katex/dist/katex.css'
import 'highlight.js/styles/github-dark.css'
import styles from './Markdown.module.scss'

const _Markdown = (
	{ className, text }: { className?: string; text: string },
	ref: ForwardedRef<HTMLDivElement>
) => (
	<div
		ref={ref}
		className={cx('overflow-x-auto overflow-y-hidden', styles.root, className)}
		dangerouslySetInnerHTML={{ __html: mdToHtml(text) }}
	/>
)

const Markdown = forwardRef(_Markdown)

export default Markdown
