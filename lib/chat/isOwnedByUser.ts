import 'server-only'

import { cache } from 'react'
import { sql, DatabasePoolConnection } from 'slonik'

import { connect } from '@/lib/pool'
import Chat from '.'

const chatIsOwnedByUser = cache(
	(chatId: string, userId: string, connection?: DatabasePoolConnection) =>
		connection
			? chatIsOwnedByUserWithConnection(chatId, userId, connection)
			: connect(connection =>
					chatIsOwnedByUserWithConnection(chatId, userId, connection)
			  )
)

const chatIsOwnedByUserWithConnection = async (
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

export default chatIsOwnedByUser
