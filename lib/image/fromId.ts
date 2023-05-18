import { cache } from 'react'
import { sql, DatabasePoolConnection } from 'slonik'

import { connect } from '@/lib/pool'
import ImageCompletion from '.'

const imageCompletionFromId = cache(
	(id: string, connection?: DatabasePoolConnection) =>
		connection
			? imageCompletionFromIdWithConnection(id, connection)
			: connect(connection =>
					imageCompletionFromIdWithConnection(id, connection)
			  )
)

const imageCompletionFromIdWithConnection = async (
	id: string,
	connection: DatabasePoolConnection
) => {
	const imageCompletions = (await connection.any(
		sql.unsafe`SELECT
					   user_id AS "userId",
					   id, prompt,
					   created, updated
				   FROM images
				   WHERE id = ${id} AND visible`
	)) as ImageCompletion[]

	return (imageCompletions[0] as ImageCompletion | undefined) ?? null
}

export default imageCompletionFromId
