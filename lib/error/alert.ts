import HttpError from './http'

const alertError = (error: HttpError) => {
	alert(error.message)
	console.error(error)
}

export default alertError
