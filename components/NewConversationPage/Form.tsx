'use client'

if (!process.env.NEXT_PUBLIC_HOST) throw new Error('Missing NEXT_PUBLIC_HOST')

import {
	ChangeEvent,
	FormEvent,
	MutableRefObject,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState
} from 'react'
import TextAreaAutosize from 'react-textarea-autosize'
import { useRecoilValue } from 'recoil'
import { useRouter, useSearchParams } from 'next/navigation'
import debounce from 'lodash/debounce'
import cx from 'classnames'

import DEV from '@/lib/dev'
import errorFromUnknown from '@/lib/error/fromUnknown'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import errorFromResponse from '@/lib/error/fromResponse'
import { ChatWithUserData } from '@/lib/chat'
import userState from '@/lib/atoms/user'
import ThreeDotsLoader from '@/components/ThreeDotsLoader'
import Markdown from '@/components/Markdown'
import ChatPreview from '@/components/Conversations/ChatPreview'
import ChatMessage from '@/lib/chat/message'
import alertError from '@/lib/error/alert'

const urlMatch = new RegExp(
	`^(?:${DEV ? 'http' : 'https'}:\\/\\/)?${process.env.NEXT_PUBLIC_HOST.replace(
		/\./g,
		'\\.'
	)}\\/chats\\/([^\\/]+)$`
)

const NewConversationPageForm = () => {
	const router = useRouter()

	const user = useRecoilValue(userState)
	const userId = user?.id ?? null

	const searchParams = useSearchParams()
	const initialChatId = searchParams.get('chat')

	const [title, setTitle] = useState('')
	const [text, setText] = useState('')
	const [url, setUrl] = useState(
		initialChatId
			? `${DEV ? 'http' : 'https'}://${process.env
					.NEXT_PUBLIC_HOST!}/chats/${encodeURIComponent(initialChatId)}`
			: ''
	)

	const [chat, setChat] = useState<ChatWithUserData | null>(null)
	const [messages, setMessages] = useState<ChatMessage[] | null>(null)

	const [chatError, setChatError] = useState<Error | null>(null)

	const trimmedTitle = title.trim()
	const trimmedText = text.trim()
	const trimmedUrl = url.trim()

	const [isLoading, setIsLoading] = useState(false)
	const disabled = !(user && trimmedTitle && chat)

	const previewUser = useMemo(
		() => chat && { photo: chat.userPhoto, name: chat.userName },
		[chat]
	)

	const onSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			try {
				event.preventDefault()
				if (!chat) return

				setIsLoading(true)

				const response = await fetch('/api/conversations', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({
						chatId: chat.id,
						title: trimmedTitle,
						text: trimmedText
					})
				})

				if (!response.ok) throw await errorFromResponse(response)

				const { id, slug } = await response.json()

				router.push(
					`/conversations/${encodeURIComponent(id)}/${encodeURIComponent(slug)}`
				)
			} catch (unknownError) {
				setIsLoading(false)
				alertError(errorFromUnknown(unknownError))
			}
		},
		[router, chat, trimmedTitle, trimmedText, setIsLoading]
	)

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

	const loadChat = useCallback(
		async (url: string, signal: AbortSignal) => {
			try {
				const encodedId = url.match(urlMatch)?.[1]
				if (!encodedId) throw new HttpError(ErrorCode.BadRequest, 'Invalid URL')

				const id = decodeURIComponent(encodedId)

				if (!userId)
					throw new HttpError(ErrorCode.Unauthorized, 'You are not signed in')

				const [chat, messages] = await Promise.all([
					(async () => {
						const response = await fetch(`/api/chats/${encodeURIComponent(id)}`)
						if (!response.ok) throw await errorFromResponse(response)

						const chat: ChatWithUserData = await response.json()

						if (userId !== chat.userId)
							throw new HttpError(
								ErrorCode.Forbidden,
								'You do not own this chat'
							)

						return chat
					})(),
					(async () => {
						const response = await fetch(
							`/api/chats/${encodeURIComponent(id)}/messages`
						)
						if (!response.ok) throw await errorFromResponse(response)

						const messages: ChatMessage[] = await response.json()

						return messages
					})()
				])

				if (signal.aborted) return

				setChat(chat)
				setMessages(messages)

				setChatError(null)
			} catch (unknownError) {
				if (signal.aborted) return

				setChat(null)
				setMessages(null)

				setChatError(errorFromUnknown(unknownError))
			}
		},
		[userId, setChat, setMessages, setChatError]
	)

	const loadChatDebounced = useMemo(() => debounce(loadChat, 500), [loadChat])

	useEffect(() => {
		setChat(null)
		setMessages(null)

		setChatError(null)

		if (!trimmedUrl) return

		const controller = new AbortController()

		loadChatDebounced(trimmedUrl, controller.signal)

		return () => {
			controller.abort()
		}
	}, [setChat, setMessages, setChatError, trimmedUrl, loadChatDebounced])

	const titleInput = useRef<HTMLTextAreaElement | null>(null)

	useEffect(() => {
		titleInput.current?.focus()
	}, [titleInput])

	return (
		<main className="flex flex-col items-stretch gap-6 px-6 py-4 overflow-y-auto">
			<form className="flex flex-col items-stretch gap-4" onSubmit={onSubmit}>
				<div className="flex justify-between items-center">
					<h1 className="text-2xl font-bold">New Conversation</h1>
					<button
						className="flex flex-col justify-center items-center w-[87.75px] h-[40px] font-bold bg-sky-500 rounded-lg transition-opacity ease-linear hover:opacity-70 disabled:opacity-50"
						disabled={disabled}
					>
						{isLoading ? <ThreeDotsLoader /> : 'Submit'}
					</button>
				</div>
				<TextAreaAutosize
					ref={titleInput}
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
				<div className="flex flex-col items-stretch gap-2">
					<input
						className="px-4 py-[0.7rem] bg-white bg-opacity-10 rounded-lg outline-none placeholder:text-white placeholder:opacity-50"
						placeholder={`${DEV ? 'http' : 'https'}://${process.env
							.NEXT_PUBLIC_HOST!}/chats/{CHAT_ID}`}
						value={url}
						onChange={onUrlChange}
					/>
					{trimmedUrl && !(chat || chatError) && (
						<p>
							<ThreeDotsLoader />
						</p>
					)}
					{chat && <p className="font-bold text-green-500">{chat.name}</p>}
					{chatError && (
						<p className="font-bold text-red-500">{chatError.message}</p>
					)}
				</div>
			</form>
			<h2 className="pb-1 border-b border-white border-opacity-50">Preview</h2>
			<div className="self-center max-w-[1500px] w-full flex flex-col items-stretch gap-4">
				<h1 className={cx('text-white', !trimmedTitle && 'text-opacity-50')}>
					{trimmedTitle || 'Title'}
				</h1>
				{trimmedText && <Markdown text={trimmedText} />}
				{trimmedUrl && !((chat && messages && previewUser) || chatError) && (
					<ThreeDotsLoader className="mx-auto mt-2" />
				)}
				{chat && messages && previewUser && (
					<ChatPreview
						chat={chat}
						user={previewUser}
						messages={messages}
						continueInNewTab
					/>
				)}
			</div>
		</main>
	)
}

export default NewConversationPageForm
