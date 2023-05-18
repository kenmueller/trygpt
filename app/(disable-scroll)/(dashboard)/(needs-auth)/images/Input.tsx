'use client'

if (!process.env.NEXT_PUBLIC_PREVIEW_IMAGE_LIMIT)
	throw new Error('Missing NEXT_PUBLIC_PREVIEW_IMAGE_LIMIT')

import {
	ChangeEvent,
	FormEvent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState
} from 'react'
import TextAreaAutosize from 'react-textarea-autosize'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { nanoid } from 'nanoid'

import SpeechButton from '@/components/ChatInput/SpeechButton'
import userState from '@/lib/atoms/user'
import imagesState from '@/lib/atoms/images'
import alertError from '@/lib/error/alert'
import errorFromUnknown from '@/lib/error/fromUnknown'
import formatCents from '@/lib/cents/format'
import errorFromResponse from '@/lib/error/fromResponse'
import ImageCompletion from '@/lib/image'

const ImagesInput = () => {
	const [user, setUser] = useRecoilState(userState)
	if (!user) throw new Error('Missing user')

	const setImages = useSetRecoilState(imagesState)

	const form = useRef<HTMLFormElement | null>(null)
	const textArea = useRef<HTMLTextAreaElement | null>(null)

	const [prompt, setPrompt] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const trimmedPrompt = prompt.trim()

	const previewImagesRemaining = user.paymentMethod
		? null
		: Number.parseInt(process.env.NEXT_PUBLIC_PREVIEW_IMAGE_LIMIT!) -
		  user.previewImages

	const disabledMessage = !user.paymentMethod
		? user.previewMessages <
		  Number.parseInt(process.env.NEXT_PUBLIC_PREVIEW_IMAGE_LIMIT!)
			? undefined
			: `You have no free images remaining. Purchase GPT 4 for ${formatCents(
					100
			  )} to continue.`
		: undefined

	const message =
		previewImagesRemaining === null
			? ''
			: `(${previewImagesRemaining} free image${
					previewImagesRemaining === 1 ? '' : 's'
			  } remaining)`

	const isDisabled = Boolean(disabledMessage)

	const addImage = useCallback(
		(image: ImageCompletion) => {
			setImages(images => images && [...images, image])
		},
		[setImages]
	)

	const updateImage = useCallback(
		(id: string, transform: (image: ImageCompletion) => ImageCompletion) => {
			setImages(
				images =>
					images &&
					images.map(image => (image.id === id ? transform(image) : image))
			)
		},
		[setImages]
	)

	const onSubmit = useCallback(
		async (prompt: string) => {
			try {
				setPrompt('')
				setIsLoading(true)

				setUser(
					user => user && { ...user, previewImages: user.previewImages + 1 }
				)

				const image: ImageCompletion = {
					userId: user.id,
					id: nanoid(),
					prompt,
					created: Date.now(),
					updated: Date.now(),
					expanded: true,
					loading: true
				}

				addImage(image)

				try {
					const response = await fetch('/api/images', {
						method: 'POST',
						body: prompt
					})

					if (!response.ok) throw await errorFromResponse(response)

					const newId = await response.text()

					updateImage(image.id, image => ({
						...image,
						id: newId,
						loading: undefined
					}))
				} catch (unknownError) {
					updateImage(image.id, image => ({
						...image,
						loading: undefined,
						error: true
					}))
				}
			} catch (unknownError) {
				alertError(errorFromUnknown(unknownError))
			} finally {
				setIsLoading(false)
			}
		},
		[user.id, setPrompt, setIsLoading, setUser, addImage, updateImage]
	)

	const _onSubmit = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault()
			if (trimmedPrompt) onSubmit(trimmedPrompt)
		},
		[onSubmit, trimmedPrompt]
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

	const onChange = useCallback(
		(event: ChangeEvent<HTMLTextAreaElement>) => {
			setPrompt(event.target.value)
		},
		[setPrompt]
	)

	const canFocus = !(isDisabled || isLoading)

	useEffect(() => {
		if (canFocus) textArea.current?.focus()
	}, [canFocus, textArea])

	return (
		<div className="flex items-end gap-4 px-4 pb-4">
			<div className="flex items-center gap-3 min-[450px]:gap-4 h-[46px]">
				<SpeechButton
					isTyping={isLoading}
					disabled={
						!(
							user.paymentMethod ||
							user.previewImages <
								Number.parseInt(process.env.NEXT_PUBLIC_PREVIEW_IMAGE_LIMIT!)
						)
					}
					submit={onSubmit}
				/>
			</div>
			<form ref={form} className="grow-[1] relative" onSubmit={_onSubmit}>
				<TextAreaAutosize
					ref={textArea}
					className="w-full h-[46px] overflow-hidden resize-none pl-4 pr-[2.7rem] py-[0.7rem] bg-white bg-opacity-10 rounded-lg outline-none placeholder:text-white placeholder:opacity-50"
					value={prompt}
					placeholder={
						isLoading
							? 'Generating...'
							: disabledMessage ??
							  `Type your image prompt...${message ? ` ${message}` : ''}`
					}
					disabled={isDisabled || isLoading}
					onChange={onChange}
				/>
				<button
					className="absolute right-[16px] bottom-[11px] text-sky-500 transition-colors ease-linear hover:text-opacity-70 disabled:text-white disabled:text-opacity-50"
					disabled={isDisabled || !trimmedPrompt || isLoading}
					aria-label="Send message"
				>
					<FontAwesomeIcon icon={faPaperPlane} />
				</button>
			</form>
		</div>
	)
}

export default ImagesInput
