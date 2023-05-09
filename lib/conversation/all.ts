import { cache } from 'react'
import { sql, DatabasePoolConnection } from 'slonik'

import { connect } from '@/lib/pool'
import Conversation from '.'

const allConversations = cache((connection?: DatabasePoolConnection) =>
	connection
		? allConversationsWithConnection(connection)
		: connect(connection => allConversationsWithConnection(connection))
)

const allConversationsWithConnection = async (
	connection: DatabasePoolConnection
) => {
	const conversations = (await connection.any(
		sql.unsafe`SELECT
					   id,
					   slug,
					   title,
					   text,
					   upvotes,
					   downvotes,
					   points,
					   views,
					   comments,
					   created,
					   updated
				   FROM conversations
				   WHERE visible`
	)) as Conversation[]

	return conversations
}

export default allConversations
