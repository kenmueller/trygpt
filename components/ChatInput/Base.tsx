'use client'

import {
	ChangeEvent,
	FormEvent,
	ReactNode,
	useCallback,
	useEffect,
	useRef
} from 'react'
import TextAreaAutosize from 'react-textarea-autosize'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

import styles from './Base.module.scss'

const BaseChatInput = ({
	disabledMessage,
	prompt,
	setPrompt,
	isLoading,
	onSubmit,
	children
}: {
	disabledMessage?: string
	prompt: string
	setPrompt: (prompt: string) => void
	isLoading: boolean
	onSubmit: (prompt: string) => void | Promise<void>
	children?: ReactNode
}) => {
	const form = useRef<HTMLFormElement | null>(null)
	const textArea = useRef<HTMLTextAreaElement | null>(null)

	const isDisabled = Boolean(disabledMessage)
	const normalizedPrompt = prompt.trim()

	const onChange = useCallback(
		(event: ChangeEvent<HTMLTextAreaElement>) => {
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

	const submit = useCallback(
		(event: KeyboardEvent) => {
			if (!(form.current && event.key === 'Enter' && !event.shiftKey)) return

			event.preventDefault()

			form.current.dispatchEvent(
				new Event('submit', { cancelable: true, bubbles: true })
			)
		},
		[form]
	)

	useEffect(() => {
		const { current } = textArea
		if (!current) return

		current.addEventListener('keydown', submit)

		return () => {
			current.removeEventListener('keydown', submit)
		}
	}, [submit])

	useEffect(() => {
		if (!isLoading) textArea.current?.focus()
	}, [isLoading, textArea])

	return (
		<div className={styles.root}>
			{children && <div className={styles.children}>{children}</div>}
			<form ref={form} className={styles.form} onSubmit={_onSubmit}>
				<TextAreaAutosize
					ref={textArea}
					className={styles.textArea}
					value={prompt}
					placeholder={disabledMessage ?? 'Type a message...'}
					disabled={isDisabled || isLoading}
					onChange={onChange}
				/>
				<button
					className={styles.submit}
					disabled={isDisabled || !normalizedPrompt || isLoading}
				>
					<FontAwesomeIcon icon={faPaperPlane} />
				</button>
			</form>
		</div>
	)
}

export default BaseChatInput
