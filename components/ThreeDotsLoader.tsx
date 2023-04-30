import cx from 'classnames'

import styles from './ThreeDotsLoader.module.scss'

const ThreeDotsLoader = ({ className }: { className?: string }) => (
	<span className={cx(styles.root, className)} aria-label="Loading">
		<span className={styles.dot} />
	</span>
)

export default ThreeDotsLoader
