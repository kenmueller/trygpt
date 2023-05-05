import { DatabasePoolConnection, sql } from 'slonik'

import { connect } from '@/lib/pool'

export interface UpdateConversationPointData {
	upvoted: boolean | null
	upvote: boolean | null
}

const updateConversationPoint = (
	conversationId: string,
	userId: string,
	data: UpdateConversationPointData,
	connection?: DatabasePoolConnection
) =>
	connection
		? updateConversationPointWithConnection(
				conversationId,
				userId,
				data,
				connection
		  )
		: connect(connection =>
				updateConversationPointWithConnection(
					conversationId,
					userId,
					data,
					connection
				)
		  )

const updateConversationPointWithConnection = async (
	conversationId: string,
	userId: string,
	{ upvoted, upvote }: UpdateConversationPointData,
	connection: DatabasePoolConnection
) => {
	// Assuming upvoted !== upvote

	if (upvoted === null) {
		// New upvote/downvote

		await connection.query(
			sql.unsafe`INSERT INTO
					   conversation_points (conversation_id, user_id, upvote)
					   VALUES (${conversationId}, ${userId}, ${upvote})`
		)
	} else if (upvote === null) {
		// Remove upvote/downvote

		await connection.query(
			sql.unsafe`DELETE FROM conversation_points
					   WHERE conversation_id = ${conversationId} AND user_id = ${userId}`
		)
	} else {
		// Change upvote/downvote

		await connection.query(
			sql.unsafe`UPDATE conversation_points
					   SET upvote = ${upvote}
					   WHERE conversation_id = ${conversationId} AND user_id = ${userId}`
		)
	}
}

export default updateConversationPoint
