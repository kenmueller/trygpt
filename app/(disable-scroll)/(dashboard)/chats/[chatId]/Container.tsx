'use client'

import { ReactNode } from 'react'
import { useRecoilValue } from 'recoil'
import cx from 'classnames'

import userState from '@/lib/atoms/user'

const ChatPageContainer = ({ children }: { children: ReactNode }) => {
	const user = useRecoilValue(userState)

	return (
		<main
			className={cx(
				'grid gap-4 overflow-y-auto',
				!user || user.paymentMethod
					? 'grid-rows-[1fr_auto]'
					: 'grid-rows-[1fr_auto_auto]'
			)}
		>
			{children}
		</main>
	)
}

export default ChatPageContainer
