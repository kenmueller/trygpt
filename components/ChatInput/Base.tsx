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

	useEffect(() => {
		if (!isLoading) textArea.current?.focus()
	}, [isLoading, textArea])

	return (
		<div className={styles.root}>
			{children && <div className={styles.children}>{children}</div>}
			<form className={styles.form} onSubmit={_onSubmit}>
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
