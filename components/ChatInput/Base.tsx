'use client'

import { ChangeEvent, FormEvent, useCallback, useEffect, useRef } from 'react'

import styles from './Base.module.scss'

const BaseChatInput = ({
	prompt,
	setPrompt,
	isLoading,
	onSubmit
}: {
	prompt: string
	setPrompt: (prompt: string) => void
	isLoading: boolean
	onSubmit: (prompt: string) => void | Promise<void>
}) => {
	const input = useRef<HTMLInputElement | null>(null)

	const onChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setPrompt(event.target.value)
		},
		[setPrompt]
	)

	const _onSubmit = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault()
			onSubmit(prompt)
		},
		[onSubmit, prompt]
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
				placeholder="Prompt"
				disabled={isLoading}
				onChange={onChange}
			/>
			<button className={styles.submit} disabled={!prompt || isLoading}>
				Submit
			</button>
		</form>
	)
}

export default BaseChatInput
