import { sql, DatabasePoolConnection } from 'slonik'
import { nanoid } from 'nanoid'

import User from '@/lib/user'
import { connect } from '@/lib/pool'

export interface CreateChatData {
	original: string | null
	name: string | null
}

const createChat = (
	user: User,
	data: CreateChatData,
	connection?: DatabasePoolConnection
) =>
	connection
		? createChatWithConnection(user, data, connection)
		: connect(connection => createChatWithConnection(user, data, connection))

const createChatWithConnection = async (
	user: User,
	{ original, name }: CreateChatData,
	connection: DatabasePoolConnection
) => {
	const id = nanoid()

	await connection.query(
		sql.unsafe`INSERT INTO
				   chats (user_id, id, original_id, name)
				   VALUES (${user.id}, ${id}, ${original}, ${name})`
	)

	return id
}

export default createChat
