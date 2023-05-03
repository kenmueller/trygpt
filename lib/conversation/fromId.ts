import { cache } from 'react'
import { sql, DatabasePoolConnection } from 'slonik'

import { connect } from '@/lib/pool'
import { ConversationWithUserAndChatData } from '.'

const conversationFromId = cache(
	(id: string, connection?: DatabasePoolConnection) =>
		connection
			? conversationFromIdWithConnection(id, connection)
			: connect(connection => conversationFromIdWithConnection(id, connection))
)

const conversationFromIdWithConnection = async (
	id: string,
	connection: DatabasePoolConnection
) => {
	const conversations = (await connection.any(
		sql.unsafe`SELECT
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
				   LEFT JOIN chats ON chats.id = conversations.chat_id
				   WHERE conversations.id = ${id} AND conversations.visible`
	)) as ConversationWithUserAndChatData[]

	return (
		(conversations[0] as ConversationWithUserAndChatData | undefined) ?? null
	)
}

export default conversationFromId
