import cx from 'classnames'

import mdToHtml from '@/lib/mdToHtml'

import 'katex/dist/katex.css'
import 'highlight.js/styles/github-dark.css'
import styles from './Markdown.module.scss'

const Markdown = ({
	className,
	text
}: {
	className?: string
	text: string
}) => (
	<div
		className={cx('overflow-x-auto overflow-y-hidden', styles.root, className)}
		dangerouslySetInnerHTML={{ __html: mdToHtml(text) }}
	/>
)

export default Markdown
