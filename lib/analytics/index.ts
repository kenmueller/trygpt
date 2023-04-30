import {
	getAnalytics,
	setUserId as _setUserId,
	logEvent as _logEvent
} from 'firebase/analytics'

import app from '@/lib/firebase'
import DEV from '@/lib/dev'

const analytics = getAnalytics(app)

export const setUserId = (userId: string | null) => {
	_setUserId(analytics, userId)
}

export const logEvent = (event: string, params?: Record<string, unknown>) => {
	_logEvent(analytics, DEV ? `dev_${event}` : event, params)
}
