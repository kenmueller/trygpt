import { toast } from 'react-toastify'

import HttpError from './http'

const alertError = (error: HttpError) => {
	toast.error(error.message)
	console.error(error)
}

export default alertError
