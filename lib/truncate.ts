const truncate = <Text extends string | null>(text: Text, maxLength: number) =>
	(text && text.slice(0, maxLength)) as Text

export default truncate
