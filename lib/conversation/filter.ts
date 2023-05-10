export const CONVERSATION_FILTERS = [
	'new-week',
	'top-day',
	'top-week',
	'top-month',
	'top-all'
] as const

type ConversationFilter = (typeof CONVERSATION_FILTERS)[number]

export default ConversationFilter
