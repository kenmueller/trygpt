import cx from 'classnames'

import styles from './ThreeDotsLoader.module.scss'

const ThreeDotsLoader = ({ className }: { className?: string }) => (
	<div className={cx(styles.root, className)}>
		<div className={styles.dot} />
	</div>
)

export default ThreeDotsLoader
