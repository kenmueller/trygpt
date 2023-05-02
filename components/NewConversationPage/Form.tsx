'use client'

import { ChangeEvent, FormEvent, useCallback, useState } from 'react'
import TextAreaAutosize from 'react-textarea-autosize'

const NewConversationPageForm = () => {
	const [title, setTitle] = useState('')
	const [text, setText] = useState('')

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
				className="h-[46px] overflow-hidden resize-none pl-4 pr-[2.7rem] py-[0.7rem] bg-white bg-opacity-10 rounded-lg outline-none placeholder:text-white placeholder:opacity-50"
				placeholder="Title"
				value={title}
				onChange={onTitleChange}
			/>
			<TextAreaAutosize
				className="h-[93.2px] overflow-hidden resize-none pl-4 pr-[2.7rem] py-[0.7rem] bg-white bg-opacity-10 rounded-lg outline-none placeholder:text-white placeholder:opacity-50"
				placeholder="Description"
				value={text}
				minRows={3}
				onChange={onTextChange}
			/>
		</form>
	)
}

export default NewConversationPageForm
