import cx from 'classnames'

import styles from './ThreeDotsLoader.module.scss'

const ThreeDotsLoader = ({ className }: { className?: string }) => (
	<div className={cx(styles.root, className)} aria-label="Loading">
		<div className={styles.dot} />
	</div>
)

export default ThreeDotsLoader
