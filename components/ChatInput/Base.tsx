'use client'

import {
	ChangeEvent,
	FormEvent,
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react'

import styles from './Base.module.scss'

const BaseChatInput = ({
	onSubmit
}: {
	onSubmit: (prompt: string) => void | Promise<void>
}) => {
	const input = useRef<HTMLInputElement | null>(null)

	const [prompt, setPrompt] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const onChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setPrompt(event.target.value)
		},
		[setPrompt]
	)

	const _onSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			try {
				event.preventDefault()

				setIsLoading(true)

				setPrompt('')
				await onSubmit(prompt)
			} finally {
				setIsLoading(false)
			}
		},
		[setIsLoading, setPrompt, onSubmit, prompt]
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
