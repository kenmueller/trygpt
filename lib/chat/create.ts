import 'server-only'

import { sql, DatabasePoolConnection } from 'slonik'

import User from '@/lib/user'
import { connect } from '@/lib/pool'
import { nanoid } from 'nanoid'

const createChat = (user: User, connection?: DatabasePoolConnection) =>
	connection
		? createChatWithConnection(user, connection)
		: connect(connection => createChatWithConnection(user, connection))

const createChatWithConnection = async (
	user: User,
	connection: DatabasePoolConnection
) => {
	const id = nanoid()

	await connection.query(
		sql.unsafe`INSERT INTO
				   chats (user_id, id)
				   VALUES (${user.id}, ${id})
				   ON CONFLICT (id) DO NOTHING`
	)

	return id
}

export default createChat
