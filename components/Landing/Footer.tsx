import styles from './Footer.module.scss'

const LandingPageFooter = () => (
	<footer className={styles.root}>
		<div className={styles.inner}>
			<h3 className={styles.title}>TryGPT</h3>
			<p className={styles.copyright}>
				Copyright &copy; 2023 TryGPT Inc. All rights reserved.
			</p>
		</div>
	</footer>
)

export default LandingPageFooter
