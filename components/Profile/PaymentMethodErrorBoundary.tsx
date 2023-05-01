'use client'

import { Component, ReactNode } from 'react'

export default class ProfilePagePaymentMethodErrorBoundary extends Component<{
	children?: ReactNode
}> {
	state = { error: null as Error | null }

	static getDerivedStateFromError = (error: Error) => ({ error })

	render = () =>
		this.state.error ? (
			<span className="font-bold text-red-500">{this.state.error.message}</span>
		) : (
			this.props.children
		)
}
