import 'server-only'

import { cache } from 'react'
import { sql, DatabasePoolConnection } from 'slonik'

import { connect } from '@/lib/pool'
import { ChatWithUserData } from '.'

const chatFromId = cache((id: string, connection?: DatabasePoolConnection) =>
	connection
		? chatFromIdWithConnection(id, connection)
		: connect(connection => chatFromIdWithConnection(id, connection))
)

const chatFromIdWithConnection = async (
	id: string,
	connection: DatabasePoolConnection
) => {
	const chats = (await connection.any(
		sql.unsafe`SELECT
				       users.id AS "userId", users.photo AS "userPhoto", users.name AS "userName",
					   chats.id, chats.name, chats.created, chats.updated
				   FROM chats
				   LEFT JOIN users ON users.id = chats.user_id
				   WHERE chats.id = ${id}`
	)) as ChatWithUserData[]

	return (chats[0] as ChatWithUserData | undefined) ?? null
}

export default chatFromId
