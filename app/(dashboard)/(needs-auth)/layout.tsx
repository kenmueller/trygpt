import { ReactNode } from 'react'
import { redirect } from 'next/navigation'

import userFromRequest from '@/lib/user/fromRequest'
import getUrl from '@/lib/getUrl'

const NeedsAuthLayout = async ({ children }: { children: ReactNode }) => {
	const url = getUrl()

	const user = await userFromRequest()
	if (!user) redirect(`/?to=${encodeURIComponent(url.pathname)}`)

	return children
}

export default NeedsAuthLayout
