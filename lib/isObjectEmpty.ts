const isObjectEmpty = (object: object): object is {} =>
	!Object.keys(object).length

export default isObjectEmpty
