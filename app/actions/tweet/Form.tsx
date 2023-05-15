'use client'

import {
	ChangeEvent,
	FormEvent,
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react'
import TextAreaAutosize from 'react-textarea-autosize'
import copy from 'copy-to-clipboard'
import { toast } from 'react-toastify'

import ThreeDotsLoader from '@/components/ThreeDotsLoader'
import alertError from '@/lib/error/alert'
import errorFromUnknown from '@/lib/error/fromUnknown'
import errorFromResponse from '@/lib/error/fromResponse'

interface ResponseValue {
	text: string
	conversationId: string
	conversationSlug: string
}

const TweetActionForm = () => {
	const [name, setName] = useState('')
	const [prompt, setPrompt] = useState('')

	const [isLoading, setIsLoading] = useState(false)
	const [responseValue, setResponseValue] = useState<ResponseValue | null>(null)

	const trimmedName = name.trim() || null
	const trimmedPrompt = prompt.trim()

	const disabled = !trimmedPrompt

	const onSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			try {
				event.preventDefault()

				setIsLoading(true)
				setResponseValue(null)

				const response = await fetch('/api/tweet', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ name: trimmedName, prompt: trimmedPrompt })
				})

				if (!response.ok) throw await errorFromResponse(response)

				const responseValue: ResponseValue = await response.json()

				setResponseValue(responseValue)
			} catch (unknownError) {
				alertError(errorFromUnknown(unknownError))
			} finally {
				setIsLoading(false)
			}
		},
		[trimmedName, trimmedPrompt, setIsLoading, setResponseValue]
	)

	const onNameChange = useCallback(
		(event: ChangeEvent<HTMLTextAreaElement>) => {
			setName(event.target.value)
		},
		[setName]
	)

	const onPromptChange = useCallback(
		(event: ChangeEvent<HTMLTextAreaElement>) => {
			setPrompt(event.target.value)
		},
		[setPrompt]
	)

	const copyText = useCallback(() => {
		if (!responseValue) return

		copy(responseValue.text)
		toast.success('Copied tweet text to clipboard')
	}, [responseValue])

	const promptInput = useRef<HTMLTextAreaElement | null>(null)

	useEffect(() => {
		promptInput.current?.focus()
	}, [promptInput])

	return (
		<main className="flex flex-col gap-6 py-4 overflow-y-auto scroll-smooth">
			<form
				className="flex flex-col items-stretch gap-4 max-w-[1500px] w-[95%] mx-auto"
				onSubmit={onSubmit}
			>
				<div className="flex justify-between items-center">
					<h1 className="text-2xl font-bold">Get Tweet Text</h1>
					<button
						className="flex flex-col justify-center items-center w-[87.75px] h-[40px] font-bold bg-sky-500 rounded-lg transition-opacity ease-linear hover:opacity-70 disabled:opacity-50"
						disabled={disabled}
					>
						{isLoading ? <ThreeDotsLoader /> : 'Submit'}
					</button>
				</div>
				<TextAreaAutosize
					className="h-[46px] overflow-hidden resize-none px-4 py-[0.7rem] bg-white bg-opacity-10 rounded-lg outline-none placeholder:text-white placeholder:opacity-50"
					placeholder="Name (optional)"
					maxLength={150}
					value={name}
					onChange={onNameChange}
				/>
				<TextAreaAutosize
					ref={promptInput}
					className="h-[93.2px] overflow-hidden resize-none px-4 py-[0.7rem] bg-white bg-opacity-10 rounded-lg outline-none placeholder:text-white placeholder:opacity-50"
					placeholder="Prompt"
					minRows={3}
					value={prompt}
					onChange={onPromptChange}
				/>
			</form>
			{responseValue && (
				<>
					<div className="flex flex-col gap-4 max-w-[1500px] w-[95%] mx-auto">
						<h2 className="pb-1 border-b border-white border-opacity-50">
							Tweet Text
						</h2>
						<p>{responseValue.text}</p>
						<div className="flex justify-start items-center gap-4">
							<button
								className="font-bold text-sky-500 underline transition-opacity ease-linear hover:opacity-70"
								onClick={copyText}
							>
								Copy Text
							</button>
							<a
								className="font-bold text-sky-500 underline transition-opacity ease-linear hover:opacity-70"
								href={`/conversations/${encodeURIComponent(
									responseValue.conversationId
								)}/${encodeURIComponent(responseValue.conversationSlug)}`}
								target="_blank"
							>
								View Conversation
							</a>
						</div>
					</div>
				</>
			)}
		</main>
	)
}

export default TweetActionForm
