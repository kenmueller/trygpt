import { cache } from 'react'
import { sql, DatabasePoolConnection } from 'slonik'

import { connect } from '@/lib/pool'
import Chat from '.'

const chatsFromUserId = cache(
	(userId: string, connection?: DatabasePoolConnection) =>
		connection
			? chatsFromUserIdWithConnection(userId, connection)
			: connect(connection => chatsFromUserIdWithConnection(userId, connection))
)

const chatsFromUserIdWithConnection = async (
	userId: string,
	connection: DatabasePoolConnection
) => {
	const chats = (await connection.any(
		sql.unsafe`SELECT
				       chats.user_id AS "userId",
					   chats.id, chats.name,
					   conversations.id AS "conversationId",
					   conversations.slug AS "conversationSlug",
					   chats.created, chats.updated
				   FROM chats
				   LEFT JOIN conversations ON conversations.chat_id = chats.id AND conversations.visible
				   WHERE chats.user_id = ${userId} AND chats.visible
				   ORDER BY chats.updated DESC`
	)) as Chat[]

	return chats
}

export default chatsFromUserId
