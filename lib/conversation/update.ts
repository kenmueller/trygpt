import { sql, DatabasePoolConnection } from 'slonik'

import { connect } from '@/lib/pool'

export interface UpdateConversationData {
	incrementUpvotes?: number
	incrementDownvotes?: number
	incrementPoints?: number
	incrementViews?: number
	comments?: number
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
	{
		incrementUpvotes,
		incrementDownvotes,
		incrementPoints,
		incrementViews,
		comments,
		updated
	}: UpdateConversationData,
	connection: DatabasePoolConnection
) => {
	await connection.query(
		sql.unsafe`UPDATE conversations
				   SET ${sql.join(
							[
								incrementUpvotes !== undefined &&
									sql.unsafe`upvotes = upvotes + ${incrementUpvotes}`,
								incrementDownvotes !== undefined &&
									sql.unsafe`downvotes = downvotes + ${incrementDownvotes}`,
								incrementPoints !== undefined &&
									sql.unsafe`points = points + ${incrementPoints}`,
								incrementViews !== undefined &&
									sql.unsafe`views = views + ${incrementViews}`,
								comments !== undefined && sql.unsafe`comments = ${comments}`,
								updated !== undefined && sql.unsafe`updated = NOW()`
							].filter(Boolean) as ReturnType<typeof sql.unsafe>[],
							sql.fragment`, `
						)}
				   WHERE id = ${id} AND visible`
	)
}

export default updateConversation
