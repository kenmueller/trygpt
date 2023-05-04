import { cache } from 'react'
import { sql, DatabasePoolConnection } from 'slonik'

import { connect } from '@/lib/pool'
import { ConversationWithUserAndChatAndPointData } from '.'
import User from '@/lib/user'

const conversationFromId = cache(
	(id: string, user: User | null, connection?: DatabasePoolConnection) =>
		connection
			? conversationFromIdWithConnection(id, user, connection)
			: connect(connection =>
					conversationFromIdWithConnection(id, user, connection)
			  )
)

const conversationFromIdWithConnection = async (
	id: string,
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
				   WHERE conversations.id = ${id} AND conversations.visible`
	)) as ConversationWithUserAndChatAndPointData[]

	return (
		(conversations[0] as ConversationWithUserAndChatAndPointData | undefined) ??
		null
	)
}

export default conversationFromId
