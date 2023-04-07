import theme from '@/styles/theme.module.scss'

const Preview = ({ title }: { title: string }) => (
	<div
		style={{
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
			height: '100%',
			padding: '16px 32px',
			wordWrap: 'break-word',
			wordBreak: 'break-word',
			color: theme.white,
			background: theme.dark
		}}
	>
		<h3
			style={{
				position: 'absolute',
				top: 0,
				left: 16,
				fontSize: 42,
				opacity: 0.5
			}}
		>
			TryGPT
		</h3>
		<h1 style={{ fontSize: 50 }}>{title}</h1>
	</div>
)

export default Preview
