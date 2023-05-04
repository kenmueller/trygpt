export const CONVERSATION_FILTERS = [
	'new-week',
	'top-day',
	'top-week',
	'top-month'
] as const

type ConversationFilter = (typeof CONVERSATION_FILTERS)[number]

export default ConversationFilter
