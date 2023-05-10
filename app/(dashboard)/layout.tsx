import { ReactNode } from 'react'

import Sidebar from '@/components/Sidebar'
import userFromRequest from '@/lib/user/fromRequest'
import chatsFromUserId from '@/lib/chat/fromUserId'
import SetDashboardLayoutState from '@/components/DashboardLayout/SetState'
import DisableScroll from '@/components/DisableScroll'

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
	const user = await userFromRequest()
	const chats = user && chatsFromUserId(user.id)

	return (
		<div className="grid grid-rows-[auto_1fr] min-[1000px]:grid-rows-none min-[1000px]:grid-cols-[auto_1fr] relative z-0 h-full">
			<SetDashboardLayoutState chats={chats} />
			<Sidebar chats={chats} />
			{children}
			<DisableScroll />
		</div>
	)
}

export default DashboardLayout
