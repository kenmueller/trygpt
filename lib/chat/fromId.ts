import 'server-only'

import { cache } from 'react'
import { sql, DatabasePoolConnection } from 'slonik'

import { connect } from '@/lib/pool'
import Chat from '.'

const chatFromId = cache((id: string, connection?: DatabasePoolConnection) =>
	connection
		? chatFromIdWithConnection(id, connection)
		: connect(connection => chatFromIdWithConnection(id, connection))
)

const chatFromIdWithConnection = async (
	id: string,
	connection: DatabasePoolConnection
) => {
	const chats: readonly Chat[] = await connection.any(
		sql.unsafe`SELECT user_id AS "userId", id, name, created, updated
				   FROM chats
				   WHERE id = ${id}
				   LIMIT 1`
	)

	return (chats[0] as Chat | undefined) ?? null
}

export default chatFromId
