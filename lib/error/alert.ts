import 'client-only'

import errorFromUnknown from './fromUnknown'

const alertError = (unknownError: unknown) => {
	alert(errorFromUnknown(unknownError).message)
	console.error(unknownError)
}

export default alertError
