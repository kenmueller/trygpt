const nextMonth = (originalDate: number | Date) => {
	const date = new Date(originalDate)

	date.setMonth(date.getMonth() + 1)

	return date
}

export default nextMonth
