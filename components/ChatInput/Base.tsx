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
	onSubmit: (prompt: string) => void
}) => {
	const input = useRef<HTMLInputElement | null>(null)
	const [prompt, setPrompt] = useState('')

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
		input.current?.focus()
	}, [input])

	return (
		<form onSubmit={_onSubmit}>
			<input value={prompt} placeholder="Prompt" onChange={onChange} />
			<button className={styles.submit} disabled={!prompt}>
				Submit
			</button>
		</form>
	)
}

export default BaseChatInput
