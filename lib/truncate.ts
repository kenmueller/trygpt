const truncate = <Text extends string | null>(
	text: Text,
	maxLength: number,
	ellipsis = false
) => {
	if (!text) return null
	if (!ellipsis) return text.slice(0, maxLength)

	return text.length <= maxLength ? text : `${text.slice(0, maxLength - 1)}…`
}

export default truncate
