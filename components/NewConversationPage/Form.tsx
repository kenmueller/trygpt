'use client'

if (!process.env.NEXT_PUBLIC_HOST) throw new Error('Missing NEXT_PUBLIC_HOST')

import { ChangeEvent, FormEvent, useCallback, useState } from 'react'
import TextAreaAutosize from 'react-textarea-autosize'

import DEV from '@/lib/dev'

const NewConversationPageForm = () => {
	const [title, setTitle] = useState('')
	const [text, setText] = useState('')
	const [url, setUrl] = useState('')

	const onSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
	}, [])

	const onTitleChange = useCallback(
		(event: ChangeEvent<HTMLTextAreaElement>) => {
			setTitle(event.target.value)
		},
		[setTitle]
	)

	const onTextChange = useCallback(
		(event: ChangeEvent<HTMLTextAreaElement>) => {
			setText(event.target.value)
		},
		[setText]
	)

	const onUrlChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setUrl(event.target.value)
		},
		[setUrl]
	)

	return (
		<form
			className="flex flex-col items-stretch gap-4 px-6 py-4"
			onSubmit={onSubmit}
		>
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">Create Conversation</h1>
				<button className="px-4 py-2 font-bold bg-sky-500 rounded-lg transition-opacity ease-linear hover:opacity-70 disabled:opacity-50">
					Submit
				</button>
			</div>
			<TextAreaAutosize
				className="h-[46px] overflow-hidden resize-none px-4 py-[0.7rem] bg-white bg-opacity-10 rounded-lg outline-none placeholder:text-white placeholder:opacity-50"
				placeholder="Title"
				value={title}
				onChange={onTitleChange}
			/>
			<TextAreaAutosize
				className="h-[93.2px] overflow-hidden resize-none px-4 py-[0.7rem] bg-white bg-opacity-10 rounded-lg outline-none placeholder:text-white placeholder:opacity-50"
				placeholder="Description"
				minRows={3}
				value={text}
				onChange={onTextChange}
			/>
			<input
				className="px-4 py-[0.7rem] bg-white bg-opacity-10 rounded-lg outline-none placeholder:text-white placeholder:opacity-50"
				placeholder={`${DEV ? 'http' : 'https'}://${process.env
					.NEXT_PUBLIC_HOST!}/chats/{CHAT_ID}`}
				value={url}
				onChange={onUrlChange}
			/>
		</form>
	)
}

export default NewConversationPageForm
