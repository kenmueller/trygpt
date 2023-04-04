import 'server-only'

import { sql, DatabasePoolConnection } from 'slonik'

import { connect } from '@/lib/pool'

const updateChatName = (
	id: string,
	name: string,
	connection?: DatabasePoolConnection
) =>
	connection
		? updateChatNameWithConnection(id, name, connection)
		: connect(connection => updateChatNameWithConnection(id, name, connection))

const updateChatNameWithConnection = async (
	id: string,
	name: string,
	connection: DatabasePoolConnection
) => {
	await connection.query(
		sql.unsafe`UPDATE chats
				   SET name = ${name}
				   WHERE id = ${id}`
	)
}

export default updateChatName
