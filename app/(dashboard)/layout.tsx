import { ReactNode } from 'react'

import Sidebar from '@/components/Sidebar'
import userFromRequest from '@/lib/user/fromRequest'
import chatsFromUserId from '@/lib/chat/fromUserId'
import SetDashboardLayoutState from '@/components/DashboardLayout/SetState'

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
	const user = await userFromRequest()
	const chats = user && chatsFromUserId(user.id)

	return (
		<div className="grid grid-cols-[auto_1fr] h-full">
			<SetDashboardLayoutState chats={chats} />
			<Sidebar chats={chats} />
			{children}
		</div>
	)
}

export default DashboardLayout
