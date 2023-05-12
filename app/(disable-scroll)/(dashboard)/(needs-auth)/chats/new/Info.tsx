'use client'

if (!process.env.NEXT_PUBLIC_PREVIEW_OPENAI_MODEL)
	throw new Error('Missing NEXT_PUBLIC_PREVIEW_OPENAI_MODEL')
if (!process.env.NEXT_PUBLIC_OPENAI_MODEL)
	throw new Error('Missing NEXT_PUBLIC_OPENAI_MODEL')
if (!process.env.NEXT_PUBLIC_PREVIEW_MESSAGE_LIMIT)
	throw new Error('Missing NEXT_PUBLIC_PREVIEW_MESSAGE_LIMIT')

import { useRecoilValue } from 'recoil'

import userState from '@/lib/atoms/user'
import modelName from '@/lib/modelName'
import PurchaseButton from '@/components/Payment/PurchaseButton'

const NewChatPageInfo = ({ className }: { className?: string }) => {
	const user = useRecoilValue(userState)
	if (!user) throw new Error('User is not signed in')

	const model = !user.paymentMethod
		? process.env.NEXT_PUBLIC_PREVIEW_OPENAI_MODEL!
		: process.env.NEXT_PUBLIC_OPENAI_MODEL!

	const previewMessagesRemaining =
		Number.parseInt(process.env.NEXT_PUBLIC_PREVIEW_MESSAGE_LIMIT!) -
		user.previewMessages

	return (
		<div className={className}>
			<h1 className="text-4xl font-black">New Chat</h1>
			<p className="mt-4 font-bold opacity-50">{modelName(model)}</p>
			{!user.paymentMethod && (
				<>
					<p className="mt-1 font-bold opacity-50">
						You have {previewMessagesRemaining} free message
						{previewMessagesRemaining === 1 ? '' : 's'} remaining
					</p>
					<PurchaseButton className="flex flex-col justify-center items-center w-60 h-10 mt-6 font-bold bg-sky-500 rounded-lg transition-opacity ease-linear hover:opacity-70" />
				</>
			)}
		</div>
	)
}

export default NewChatPageInfo
