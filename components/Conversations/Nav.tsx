'use client'

import { useCallback, useLayoutEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRecoilValue } from 'recoil'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import userState from '@/lib/atoms/user'
import SignInButton from '@/components/SignInButton'
import Search from './Search'
import defaultUserImage from '@/assets/user.png'

const ConversationsNav = () => {
	const user = useRecoilValue(userState)

	const [isSearchInline, setIsSearchInline] = useState(true)

	const onMediaQueryChange = useCallback(
		({ matches }: MediaQueryListEvent) => {
			setIsSearchInline(matches)
		},
		[setIsSearchInline]
	)

	useLayoutEffect(() => {
		const mediaQuery = window.matchMedia('(min-width: 700px)')

		onMediaQueryChange(
			new MediaQueryListEvent('change', { matches: mediaQuery.matches })
		)

		mediaQuery.addEventListener('change', onMediaQueryChange)

		return () => {
			mediaQuery.removeEventListener('change', onMediaQueryChange)
		}
	}, [onMediaQueryChange])

	return (
		<div className="flex flex-col items-stretch gap-4 max-w-[1500px] w-[95%] mx-auto py-4">
			<nav className="flex items-center gap-4">
				<h1 className="shrink-0 text-xl">
					<Link className="hover:underline" href="/">
						TryGPT
					</Link>{' '}
					<Link className="hover:underline" href="/conversations">
						<strong>Conversations</strong>
					</Link>
				</h1>
				<div className="grow-[1]">
					{isSearchInline && <Search className="hidden w-700:flex" />}
				</div>
				<Link
					className="shrink-0 flex items-center gap-2 font-bold"
					href="/conversations/new"
				>
					<FontAwesomeIcon className="text-xl" icon={faPlus} />
					<span>
						New <span className="hidden w-900:inline">Conversation</span>
					</span>
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
						<span className="hidden w-900:inline">{user.name}</span>
					</Link>
				) : (
					<SignInButton
						className="shrink-0 flex justify-center items-center w-28 h-10 font-bold bg-white bg-opacity-10 rounded-full transition-colors ease-linear hover:bg-opacity-20"
						iconClassName="shrink-0 mr-2 text-xl"
					/>
				)}
			</nav>
			{!isSearchInline && <Search />}
		</div>
	)
}

export default ConversationsNav
