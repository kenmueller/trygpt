'use client'

import { ChangeEvent, FormEvent, useCallback, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useRecoilValue } from 'recoil'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import userState from '@/lib/atoms/user'
import SignInButton from '@/components/SignInButton'
import defaultUserImage from '@/assets/user.png'

const ConversationsNav = () => {
	const router = useRouter()
	const searchParams = useSearchParams()

	const user = useRecoilValue(userState)

	const searchQueryInitialValue = searchParams.get('q') ?? ''
	const [searchQuery, setSearchQuery] = useState(searchQueryInitialValue)

	const onSearchSubmit = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault()
			router.push(`/conversations/search?q=${encodeURIComponent(searchQuery)}`)
		},
		[router, searchQuery]
	)

	const onSearchQueryChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setSearchQuery(event.target.value)
		},
		[setSearchQuery]
	)

	return (
		<nav className="flex items-center gap-4 px-6 py-4">
			<Link className="shrink-0 text-xl" href="/conversations">
				TryGPT <strong>Conversations</strong>
			</Link>
			<form
				className="grow-[1] flex items-center gap-2"
				onSubmit={onSearchSubmit}
			>
				<input
					className="grow-[1] min-w-0 bg-white bg-opacity-10"
					placeholder="Search"
					value={searchQuery}
					onChange={onSearchQueryChange}
				/>
				<button>Search</button>
			</form>
			<Link
				className="shrink-0 flex items-center gap-2 font-bold"
				href="/conversations/new"
			>
				<FontAwesomeIcon className="text-xl" icon={faPlus} />
				New Conversation
			</Link>
			{user ? (
				<Link
					className="shrink-0 flex items-center gap-3 font-bold transition-opacity ease-linear hover:opacity-70"
					href="/profile"
				>
					<Image
						className="rounded-lg"
						src={user.photo ?? defaultUserImage}
						alt={user.name}
						referrerPolicy={user.photo ? 'no-referrer' : undefined}
						width={30}
						height={30}
						priority
					/>
					{user.name}
				</Link>
			) : (
				<SignInButton
					className="shrink-0 flex justify-center items-center w-28 h-10 font-bold bg-white bg-opacity-10 rounded-full transition-colors ease-linear hover:bg-opacity-20"
					iconClassName="shrink-0 mr-2 text-xl"
				/>
			)}
		</nav>
	)
}

export default ConversationsNav
