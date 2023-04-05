import cx from 'classnames'

import mdToHtml from '@/lib/mdToHtml'

import styles from './Markdown.module.scss'

const Markdown = ({
	className,
	text
}: {
	className?: string
	text: string
}) => (
	<div
		className={cx(styles.root, className)}
		dangerouslySetInnerHTML={{ __html: mdToHtml(text) }}
	/>
)

export default Markdown
