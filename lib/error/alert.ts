import DEV from '@/lib/dev'
import HttpError from './http'

const alertError = (error: HttpError) => {
	if (DEV) alert(error.message)
	console.error(error)
}

export default alertError
