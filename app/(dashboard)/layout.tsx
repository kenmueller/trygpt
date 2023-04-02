import { ReactNode } from 'react'
import { redirect } from 'next/navigation'

import userFromRequest from '@/lib/user/fromRequest'
import Sidebar from '@/components/Sidebar'
import InitialPromptProvider from '@/components/InitialPromptProvider'

import styles from './layout.module.scss'

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
	const user = await userFromRequest()
	if (!user) redirect('/')

	return (
		<div className={styles.root}>
			<Sidebar user={user} />
			<InitialPromptProvider>{children}</InitialPromptProvider>
		</div>
	)
}

export default DashboardLayout
