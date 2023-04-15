import { ReactNode } from 'react'

import userFromRequest from '@/lib/user/fromRequest'
import Sidebar from '@/components/Sidebar'
import InitialMessagesProvider from '@/components/Provider/InitialMessages'
import ChatsProvider from '@/components/Provider/Chats'

import styles from './layout.module.scss'

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
	const user = await userFromRequest()

	return (
		<ChatsProvider>
			<InitialMessagesProvider>
				<div className={styles.root}>
					<Sidebar user={user} />
					{children}
				</div>
			</InitialMessagesProvider>
		</ChatsProvider>
	)
}

export default DashboardLayout
