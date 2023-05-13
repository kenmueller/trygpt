const truncate = <Text extends string | null>(
	text: Text,
	maxLength: number,
	ellipsis = false
) => {
	if (!text) return null as Text
	if (!ellipsis) return text.slice(0, maxLength) as Text

	return (
		text.length <= maxLength ? text : `${text.slice(0, maxLength - 1)}…`
	) as Text
}

export default truncate
