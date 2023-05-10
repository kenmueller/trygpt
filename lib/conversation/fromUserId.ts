import { cache } from 'react'
import { sql, DatabasePoolConnection } from 'slonik'

import { connect } from '@/lib/pool'
import { ConversationWithUserAndChatAndPointData } from '.'
import User from '@/lib/user'

const conversationsFromUserId = cache(
	(userId: string, user: User | null, connection?: DatabasePoolConnection) =>
		connection
			? conversationsFromUserIdWithConnection(userId, user, connection)
			: connect(connection =>
					conversationsFromUserIdWithConnection(userId, user, connection)
			  )
)

const conversationsFromUserIdWithConnection = async (
	userId: string,
	user: User | null,
	connection: DatabasePoolConnection
) => {
	const conversations = (await connection.any(
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
					   conversation_points.user_id = ${user?.id ?? null}
				   WHERE conversations.user_id = ${userId} AND conversations.visible
				   ORDER BY conversations.updated DESC`
	)) as ConversationWithUserAndChatAndPointData[]

	return conversations
}

export default conversationsFromUserId
