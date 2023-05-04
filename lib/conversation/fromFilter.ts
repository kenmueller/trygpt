import { cache } from 'react'
import { DatabasePoolConnection, sql } from 'slonik'

import ConversationFilter from './filter'
import { connect } from '@/lib/pool'
import { ConversationWithUserAndChatData } from '.'

const SELECT = sql.unsafe`SELECT
						      users.id AS "userId", users.photo AS "userPhoto", users.name AS "userName", users.points AS "userPoints",
						      chats.id AS "chatId", chats.name AS "chatName",
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
						  LEFT JOIN chats ON chats.id = conversations.chat_id`

const conversationsFromFilter = cache(
	(filter: ConversationFilter, connection?: DatabasePoolConnection) =>
		connection
			? conversationsFromFilterWithConnection(filter, connection)
			: connect(connection =>
					conversationsFromFilterWithConnection(filter, connection)
			  )
)

const conversationsFromFilterWithConnection = async (
	filter: ConversationFilter,
	connection: DatabasePoolConnection
) => {
	switch (filter) {
		case 'new-week':
			return (await connection.any(sql.unsafe`${SELECT}
													WHERE conversations.created >= NOW() - INTERVAL '7 DAYS' AND conversations.visible
													ORDER BY conversations.created DESC`)) as ConversationWithUserAndChatData[]
		case 'top-day':
			return (await connection.any(sql.unsafe`${SELECT}
													WHERE conversations.created >= NOW() - INTERVAL '1 DAY' AND conversations.visible
													ORDER BY conversations.points DESC`)) as ConversationWithUserAndChatData[]
		case 'top-week':
			return (await connection.any(sql.unsafe`${SELECT}
													WHERE conversations.created >= NOW() - INTERVAL '7 DAYS' AND conversations.visible
													ORDER BY conversations.points DESC`)) as ConversationWithUserAndChatData[]
		case 'top-month':
			return (await connection.any(sql.unsafe`${SELECT}
													WHERE conversations.created >= NOW() - INTERVAL '30 DAYS' AND conversations.visible
													ORDER BY conversations.points DESC`)) as ConversationWithUserAndChatData[]
	}
}

export default conversationsFromFilter
