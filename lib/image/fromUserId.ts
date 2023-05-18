import { cache } from 'react'
import { sql, DatabasePoolConnection } from 'slonik'

import { connect } from '@/lib/pool'
import ImageCompletion from '.'

const imagesFromUserId = cache(
	(userId: string, connection?: DatabasePoolConnection) =>
		connection
			? imagesFromUserIdWithConnection(userId, connection)
			: connect(connection =>
					imagesFromUserIdWithConnection(userId, connection)
			  )
)

const imagesFromUserIdWithConnection = async (
	userId: string,
	connection: DatabasePoolConnection
) => {
	const images = (await connection.any(
		sql.unsafe`SELECT
				       user_id AS "userId",
					   id, prompt,
					   created, updated
				   FROM images
				   WHERE user_id = ${userId} AND visible
				   ORDER BY images.created ASC`
	)) as ImageCompletion[]

	return images
}

export default imagesFromUserId
