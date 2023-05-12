'use client'

import {
	ChangeEvent,
	FormEvent,
	ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState
} from 'react'
import TextAreaAutosize from 'react-textarea-autosize'
import { useRecoilValue } from 'recoil'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faArrowDown,
	faArrowUp,
	faShareSquare
} from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import errorFromUnknown from '@/lib/error/fromUnknown'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import errorFromResponse from '@/lib/error/fromResponse'
import { ChatWithUserData } from '@/lib/chat'
import userState from '@/lib/atoms/user'
import ThreeDotsLoader from '@/components/ThreeDotsLoader'
import Markdown from '@/components/Markdown'
import ChatPreview from '@/components/Conversation/ChatPreview'
import ChatMessage from '@/lib/chat/message'
import alertError from '@/lib/error/alert'
import formatDate from '@/lib/date/format'
import defaultUserImage from '@/assets/user.png'
import newConversationSelectedChatIdState from '@/lib/atoms/newConversationSelectedChatId'

const NewConversationPageForm = ({ children }: { children: ReactNode }) => {
	const router = useRouter()

	const user = useRecoilValue(userState)
	const userId = user?.id ?? null

	const [title, setTitle] = useState('')
	const [text, setText] = useState('')

	const selectedChatId = useRecoilValue(newConversationSelectedChatIdState)
	const [chat, setChat] = useState<ChatWithUserData | null>(null)
	const [messages, setMessages] = useState<ChatMessage[] | null>(null)

	const [chatError, setChatError] = useState<Error | null>(null)

	const trimmedTitle = title.trim()
	const trimmedText = text.trim()

	const [isLoading, setIsLoading] = useState(false)
	const disabled = !(user && chat)

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

	const loadChat = useCallback(
		async (id: string, signal: AbortSignal) => {
			try {
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

						if (chat.conversationId)
							throw new HttpError(
								ErrorCode.Forbidden,
								'This chat has already been posted as a conversation'
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

	useEffect(() => {
		setChat(null)
		setMessages(null)

		setChatError(null)

		if (!selectedChatId) return

		const controller = new AbortController()

		loadChat(selectedChatId, controller.signal)

		return () => {
			controller.abort()
		}
	}, [setChat, setMessages, setChatError, selectedChatId, loadChat])

	const titleInput = useRef<HTMLTextAreaElement | null>(null)

	useEffect(() => {
		titleInput.current?.focus()
	}, [titleInput])

	return (
		<main className="flex flex-col gap-6 py-4 overflow-y-auto scroll-smooth">
			<form
				className="flex flex-col items-stretch gap-4 max-w-[1500px] w-[95%] mx-auto"
				onSubmit={onSubmit}
			>
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
					placeholder="Title (optional)"
					maxLength={150}
					value={title}
					onChange={onTitleChange}
				/>
				<TextAreaAutosize
					className="h-[93.2px] overflow-hidden resize-none px-4 py-[0.7rem] bg-white bg-opacity-10 rounded-lg outline-none placeholder:text-white placeholder:opacity-50"
					placeholder="Description (optional)"
					minRows={3}
					value={text}
					onChange={onTextChange}
				/>
				{children}
			</form>
			<h2 className="max-w-[1500px] w-[95%] mx-auto pb-1 border-b border-white border-opacity-50">
				Preview
			</h2>
			<div className="flex flex-col items-stretch gap-4 max-w-[1500px] w-[95%] mx-auto">
				<div className="flex items-start gap-3 min-[600px]:gap-6">
					<div className="shrink-0 flex flex-col items-center pt-1">
						<button
							className={cx(
								'leading-4 px-2 py-1.5 bg-opacity-10 rounded-lg transition-colors ease-linear',
								'text-white bg-white'
							)}
							aria-label="0"
							data-balloon-pos="right"
						>
							<FontAwesomeIcon icon={faArrowUp} />
						</button>
						<p className="font-bold">0</p>
						<button
							className="leading-4 px-2 py-1.5 text-white bg-white bg-opacity-10 rounded-lg transition-colors ease-linear"
							aria-label="0"
							data-balloon-pos="right"
						>
							<FontAwesomeIcon icon={faArrowDown} />
						</button>
					</div>
					<div className="grow-[1] flex flex-col items-stretch gap-2">
						<h1
							className={cx(
								'text-2xl min-[600px]:text-3xl text-white',
								!(trimmedTitle || chat?.name) && 'text-opacity-50'
							)}
						>
							{trimmedTitle || chat?.name || 'Title'}
						</h1>
						<div className="flex flex-col items-start gap-1">
							<p className="flex items-center gap-2 font-bold text-white text-opacity-50 cursor-pointer hover:underline">
								<Image
									className="rounded-lg"
									src={user?.photo ?? defaultUserImage}
									alt={user?.name ?? 'Anonymous'}
									referrerPolicy={user?.photo ? 'no-referrer' : undefined}
									width={25}
									height={25}
									priority
								/>
								{user?.name ?? 'Anonymous'} ({user?.points ?? 0})
							</p>
							<p className="font-bold text-white text-opacity-50">
								0 views •{' '}
								<span className="cursor-pointer hover:underline">
									0 comments
								</span>{' '}
								• {formatDate(new Date())} •
								<button className="inline-flex items-center ml-1.5 align-middle translate-y-[-1.5px] font-bold text-white text-opacity-50 transition-opacity ease-linear hover:opacity-70">
									<FontAwesomeIcon className="mr-1" icon={faShareSquare} />
									<span className="translate-y-[1px]">Share</span>
								</button>
							</p>
						</div>
					</div>
				</div>
				{trimmedText && <Markdown text={trimmedText} />}
				{selectedChatId &&
					!((chat && messages && previewUser) || chatError) && (
						<ThreeDotsLoader className="mx-auto mt-2" />
					)}
				{chat && messages && previewUser && (
					<ChatPreview
						title={trimmedTitle}
						chat={chat}
						user={previewUser}
						messages={messages}
						continueInNewTab
					/>
				)}
				{chatError && (
					<p className="font-bold text-red-500">{chatError.message}</p>
				)}
			</div>
		</main>
	)
}

export default NewConversationPageForm
