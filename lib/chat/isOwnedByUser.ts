import 'server-only'

import { cache } from 'react'
import { sql, DatabasePoolConnection } from 'slonik'

import { connect } from '@/lib/pool'

const isChatOwnedByUser = cache(
	(chatId: string, userId: string, connection?: DatabasePoolConnection) =>
		connection
			? isChatOwnedByUserWithConnection(chatId, userId, connection)
			: connect(connection =>
					isChatOwnedByUserWithConnection(chatId, userId, connection)
			  )
)

const isChatOwnedByUserWithConnection = async (
	chatId: string,
	userId: string,
	connection: DatabasePoolConnection
) => {
	const [{ exists }] = (await connection.any(
		sql.unsafe`SELECT EXISTS(
				      SELECT 1
					  FROM chats
					  WHERE user_id = ${userId} AND id = ${chatId}
				   )`
	)) as [{ exists: boolean }]

	return exists
}

export default isChatOwnedByUser
