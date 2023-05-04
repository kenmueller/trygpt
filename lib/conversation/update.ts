import { sql, DatabasePoolConnection } from 'slonik'

import { connect } from '@/lib/pool'

export interface UpdateConversationData {
	incrementViews?: number
	updated?: 'now'
}

const updateConversation = (
	id: string,
	data: UpdateConversationData,
	connection?: DatabasePoolConnection
) =>
	connection
		? updateConversationWithConnection(id, data, connection)
		: connect(connection =>
				updateConversationWithConnection(id, data, connection)
		  )

const updateConversationWithConnection = async (
	id: string,
	{ incrementViews, updated }: UpdateConversationData,
	connection: DatabasePoolConnection
) => {
	await connection.query(
		sql.unsafe`UPDATE conversations
				   SET ${sql.join(
							[
								incrementViews !== undefined &&
									sql.unsafe`views = views + ${incrementViews}`,
								updated !== undefined && sql.unsafe`updated = NOW()`
							].filter(Boolean) as ReturnType<typeof sql.unsafe>[],
							sql.fragment`, `
						)}
				   WHERE id = ${id} AND visible`
	)
}

export default updateConversation
