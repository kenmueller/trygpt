import 'server-only'

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
	const chats: readonly Chat[] = await connection.any(
		sql.unsafe`SELECT user_id AS "userId", id, name, created, updated
				   FROM chats
				   WHERE user_id = ${userId}
				   ORDER BY updated DESC`
	)

	return chats as Chat[]
}

export default chatsFromUserId
