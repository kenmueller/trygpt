import { sql, DatabasePoolConnection } from 'slonik'

import { connect } from '@/lib/pool'

export interface UpdateChatData {
	name?: string
	updated?: 'now'
}

const updateChat = (
	id: string,
	data: UpdateChatData,
	connection?: DatabasePoolConnection
) =>
	connection
		? updateChatWithConnection(id, data, connection)
		: connect(connection => updateChatWithConnection(id, data, connection))

const updateChatWithConnection = async (
	id: string,
	{ name, updated }: UpdateChatData,
	connection: DatabasePoolConnection
) => {
	await connection.query(
		sql.unsafe`UPDATE chats
				   SET ${sql.join(
							[
								name !== undefined && sql.unsafe`name = ${name}`,
								updated !== undefined && sql.unsafe`updated = NOW()`
							].filter(Boolean) as ReturnType<typeof sql.unsafe>[],
							sql.fragment`, `
						)}
				   WHERE id = ${id}`
	)
}

export default updateChat
