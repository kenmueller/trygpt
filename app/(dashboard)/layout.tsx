import { ReactNode } from 'react'

import userFromRequest from '@/lib/user/fromRequest'
import Sidebar from '@/components/Sidebar'
import InitialPromptProvider from '@/components/Provider/InitialPrompt'
import ChatsProvider from '@/components/Provider/Chats'

import styles from './layout.module.scss'

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
	const user = await userFromRequest()

	return (
		<ChatsProvider>
			<InitialPromptProvider>
				<div className={styles.root}>
					<Sidebar user={user} />
					{children}
				</div>
			</InitialPromptProvider>
		</ChatsProvider>
	)
}

export default DashboardLayout
