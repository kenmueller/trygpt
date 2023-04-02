import HttpError from './http'
import DEFAULT_ERROR_MESSAGE from './defaultMessage'
import ErrorCode from './code'

const errorFromUnknown = (unknownError: unknown) =>
	unknownError instanceof HttpError
		? unknownError
		: new HttpError(
				ErrorCode.Internal,
				unknownError instanceof Error
					? unknownError.message
					: DEFAULT_ERROR_MESSAGE
		  )

export default errorFromUnknown
