export const CONVERSATION_FILTERS = [
	'new-week',
	'top-day',
	'top-week',
	'top-month',
	'top-all'
] as const

type ConversationFilter = (typeof CONVERSATION_FILTERS)[number]

export const filterName = (filter: ConversationFilter) => {
	switch (filter) {
		case 'new-week':
			return 'New this week'
		case 'top-day':
			return 'Top today'
		case 'top-week':
			return 'Top this week'
		case 'top-month':
			return 'Top this month'
		case 'top-all':
			return 'Top of all time'
	}
}

export default ConversationFilter
