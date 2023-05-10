import { cache } from 'react'
import { DatabasePoolConnection, sql } from 'slonik'

import ConversationFilter from './filter'
import { connect } from '@/lib/pool'
import { ConversationWithUserAndChatAndPointData } from '.'
import User from '@/lib/user'

const SELECT = (user: User | null) =>
	sql.unsafe`SELECT
				   users.id AS "userId", users.photo AS "userPhoto", users.name AS "userName", users.points AS "userPoints",
				   chats.id AS "chatId", chats.name AS "chatName",
				   conversation_points.upvote AS upvoted,
				   conversations.id,
				   conversations.slug,
				   conversations.title,
				   conversations.text,
				   conversations.upvotes,
				   conversations.downvotes,
				   conversations.points,
				   conversations.views,
				   conversations.comments,
				   conversations.created,
				   conversations.updated
			   FROM conversations
			   LEFT JOIN users ON users.id = conversations.user_id
			   LEFT JOIN chats ON chats.id = conversations.chat_id
			   LEFT JOIN conversation_points ON
				   conversation_points.conversation_id = conversations.id AND
				   conversation_points.user_id = ${user?.id ?? null}`

const conversationsFromFilter = cache(
	(
		filter: ConversationFilter,
		user: User | null,
		connection?: DatabasePoolConnection
	) =>
		connection
			? conversationsFromFilterWithConnection(filter, user, connection)
			: connect(connection =>
					conversationsFromFilterWithConnection(filter, user, connection)
			  )
)

const conversationsFromFilterWithConnection = async (
	filter: ConversationFilter,
	user: User | null,
	connection: DatabasePoolConnection
) => {
	switch (filter) {
		case 'new-week':
			return (await connection.any(sql.unsafe`${SELECT(user)}
													WHERE conversations.created >= NOW() - INTERVAL '7 DAYS' AND conversations.visible
													ORDER BY conversations.created DESC`)) as ConversationWithUserAndChatAndPointData[]
		case 'top-day':
			return (await connection.any(sql.unsafe`${SELECT(user)}
													WHERE conversations.created >= NOW() - INTERVAL '1 DAY' AND conversations.visible
													ORDER BY conversations.points DESC`)) as ConversationWithUserAndChatAndPointData[]
		case 'top-week':
			return (await connection.any(sql.unsafe`${SELECT(user)}
													WHERE conversations.created >= NOW() - INTERVAL '7 DAYS' AND conversations.visible
													ORDER BY conversations.points DESC`)) as ConversationWithUserAndChatAndPointData[]
		case 'top-month':
			return (await connection.any(sql.unsafe`${SELECT(user)}
													WHERE conversations.created >= NOW() - INTERVAL '30 DAYS' AND conversations.visible
													ORDER BY conversations.points DESC`)) as ConversationWithUserAndChatAndPointData[]
		case 'top-all':
			return (await connection.any(sql.unsafe`${SELECT(user)}
													WHERE conversations.visible
													ORDER BY conversations.points DESC`)) as ConversationWithUserAndChatAndPointData[]
	}
}

export default conversationsFromFilter
