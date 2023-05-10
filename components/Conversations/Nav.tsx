'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRecoilValue } from 'recoil'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faRankingStar } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import userState from '@/lib/atoms/user'
import SignInButton from '@/components/SignInButton'
import Search from './Search'
import defaultUserImage from '@/assets/user.png'

const ConversationsNav = () => {
	const user = useRecoilValue(userState)

	return (
		<nav className="flex flex-col items-stretch gap-4 max-w-[1500px] w-[95%] mx-auto py-4">
			<div className="flex items-center gap-4">
				<h1 className="shrink-0 flex items-center gap-2 mr-auto min-[800px]:mr-0 text-lg min-[400px]:text-xl">
					<Link className="hover:underline" href="/">
						TryGPT
					</Link>
					<span className="self-stretch w-[2px] bg-white bg-opacity-50 rounded-full" />
					<Link className="hover:underline" href="/conversations">
						<strong>Conversations</strong>
					</Link>
				</h1>
				<ConversationsNavSearchWithButtons className="grow-[1] hidden min-[800px]:flex" />
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
						<span className="hidden min-[1000px]:inline">
							{user.name} ({user.points})
						</span>
					</Link>
				) : (
					<SignInButton
						className="shrink-0 flex justify-center items-center w-28 h-10 font-bold bg-white bg-opacity-10 rounded-full transition-colors ease-linear hover:bg-opacity-20"
						iconClassName="shrink-0 mr-2 text-xl"
					/>
				)}
			</div>
			<ConversationsNavSearchWithButtons className="min-[800px]:hidden" />
		</nav>
	)
}

const ConversationsNavSearchWithButtons = ({
	className
}: {
	className?: string
}) => (
	<div className={cx('flex items-center gap-4', className)}>
		<Search className="grow-[1]" />
		<Link
			className="shrink-0 flex items-center gap-2 font-bold hover:opacity-70 transition-opacity ease-linear"
			href="/conversations/new"
		>
			<FontAwesomeIcon className="text-xl" icon={faPlus} />
			<span className="hidden min-[520px]:inline">
				New<span className="hidden min-[1000px]:inline"> Conversation</span>
			</span>
		</Link>
		<Link
			className="shrink-0 flex items-center gap-2 font-bold hover:opacity-70 transition-opacity ease-linear"
			href="/leaderboard"
		>
			<FontAwesomeIcon
				className="text-xl translate-y-[-1.5px]"
				icon={faRankingStar}
			/>
		</Link>
	</div>
)

export default ConversationsNav
