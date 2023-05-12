'use client'

import { useRecoilValue } from 'recoil'

import userState from '@/lib/atoms/user'
import PurchaseButton from '@/components/Payment/PurchaseButton'

const ChatPagePurchaseButton = () => {
	const user = useRecoilValue(userState)
	if (!user || user.paymentMethod) return null

	return (
		<PurchaseButton className="justify-self-center flex flex-col justify-center items-center w-60 h-10 font-bold bg-sky-500 rounded-lg transition-opacity ease-linear hover:opacity-70" />
	)
}

export default ChatPagePurchaseButton
