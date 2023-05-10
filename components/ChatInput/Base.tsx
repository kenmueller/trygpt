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
import cx from 'classnames'

const BaseChatInput = ({
	disabledMessage,
	message,
	prompt,
	setPrompt,
	isLoading,
	onSubmit,
	collapseChildrenIntoGrid = true,
	children
}: {
	disabledMessage?: string
	message?: string
	prompt: string
	setPrompt: (prompt: string) => void
	isLoading: boolean
	onSubmit: (prompt: string) => void | Promise<void>
	collapseChildrenIntoGrid?: boolean
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
			if (normalizedPrompt) onSubmit(normalizedPrompt)
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

	const canFocus = !(isDisabled || isLoading)

	useEffect(() => {
		if (canFocus) textArea.current?.focus()
	}, [canFocus, textArea])

	return (
		<div className="flex items-end gap-4 px-4 pb-4">
			{children && (
				<div
					className={cx(
						collapseChildrenIntoGrid
							? 'grid grid-cols-2 gap-1 min-[450px]:flex min-[450px]:items-center min-[450px]:gap-4 min-[450px]:h-[46px]'
							: 'flex items-center gap-3 min-[450px]:gap-4 h-[46px]'
					)}
				>
					{children}
				</div>
			)}
			<form ref={form} className="grow-[1] relative" onSubmit={_onSubmit}>
				<TextAreaAutosize
					ref={textArea}
					className="w-full h-[46px] overflow-hidden resize-none pl-4 pr-[2.7rem] py-[0.7rem] bg-white bg-opacity-10 rounded-lg outline-none placeholder:text-white placeholder:opacity-50"
					value={prompt}
					placeholder={
						isLoading
							? 'Typing...'
							: disabledMessage ??
							  `Type a message...${message ? ` ${message}` : ''}`
					}
					disabled={isDisabled || isLoading}
					onChange={onChange}
				/>
				<button
					className="absolute right-[16px] bottom-[11px] text-sky-500 transition-colors ease-linear hover:text-opacity-70 disabled:text-white disabled:text-opacity-50"
					disabled={isDisabled || !normalizedPrompt || isLoading}
					aria-label="Send message"
				>
					<FontAwesomeIcon icon={faPaperPlane} />
				</button>
			</form>
		</div>
	)
}

export default BaseChatInput
