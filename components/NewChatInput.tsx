'use client'

import {
	ChangeEvent,
	FormEvent,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState
} from 'react'
import { useRouter } from 'next/navigation'

import alertError from '@/lib/error/alert'
import errorFromResponse from '@/lib/error/fromResponse'
import InitialPromptContext from '@/lib/initialPrompt/context'

import styles from './NewChatInput.module.scss'

const NewChatInput = () => {
	const router = useRouter()

	const input = useRef<HTMLInputElement | null>(null)

	const [prompt, setPrompt] = useState('')
	const [, setInitialPrompt] = useContext(InitialPromptContext)

	const onChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setPrompt(event.target.value)
		},
		[setPrompt]
	)

	const onSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			try {
				event.preventDefault()

				const response = await fetch('/api/chats', { method: 'POST' })
				if (!response.ok) throw await errorFromResponse(response)

				const id = await response.text()

				setInitialPrompt(prompt)
				router.push(`/chats/${encodeURIComponent(id)}`)
			} catch (unknownError) {
				alertError(unknownError)
			}
		},
		[router, prompt, setInitialPrompt]
	)

	useEffect(() => {
		input.current?.focus()
	}, [input])

	return (
		<form onSubmit={onSubmit}>
			<input value={prompt} placeholder="Prompt" onChange={onChange} />
			<button className={styles.submit} disabled={!prompt}>
				Submit
			</button>
		</form>
	)
}

export default NewChatInput
