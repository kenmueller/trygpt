'use client'

import { ChangeEvent, FormEvent, useCallback, useEffect, useRef } from 'react'

import styles from './Base.module.scss'

const BaseChatInput = ({
	disabledMessage,
	prompt,
	setPrompt,
	isLoading,
	onSubmit
}: {
	disabledMessage?: string
	prompt: string
	setPrompt: (prompt: string) => void
	isLoading: boolean
	onSubmit: (prompt: string) => void | Promise<void>
}) => {
	const input = useRef<HTMLInputElement | null>(null)

	const isDisabled = Boolean(disabledMessage)
	const normalizedPrompt = prompt.trim()

	const onChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setPrompt(event.target.value)
		},
		[setPrompt]
	)

	const _onSubmit = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault()
			onSubmit(normalizedPrompt)
		},
		[onSubmit, normalizedPrompt]
	)

	useEffect(() => {
		if (!isLoading) input.current?.focus()
	}, [isLoading, input])

	return (
		<form className={styles.root} onSubmit={_onSubmit}>
			<input
				ref={input}
				className={styles.input}
				value={prompt}
				placeholder={disabledMessage ?? 'Type a message...'}
				disabled={isDisabled || isLoading}
				onChange={onChange}
			/>
			<button
				className={styles.submit}
				disabled={isDisabled || !normalizedPrompt || isLoading}
			>
				Submit
			</button>
		</form>
	)
}

export default BaseChatInput
