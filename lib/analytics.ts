import { getAnalytics } from 'firebase/analytics'

import app from './firebase'

const analytics = getAnalytics(app)

export default analytics
