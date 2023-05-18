import { DatabasePoolConnection, sql } from 'slonik'

import User from '@/lib/user'
import { connect } from '@/lib/pool'

export interface AddImageCompletionData {
	id: string
	prompt: string
}

const addImageCompletion = (
	user: User,
	data: AddImageCompletionData,
	connection?: DatabasePoolConnection
) =>
	connection
		? addImageCompletionWithConnection(user, data, connection)
		: connect(connection =>
				addImageCompletionWithConnection(user, data, connection)
		  )

const addImageCompletionWithConnection = async (
	user: User,
	{ id, prompt }: AddImageCompletionData,
	connection: DatabasePoolConnection
) => {
	await connection.query(
		sql.unsafe`INSERT INTO
				   images (user_id, id, prompt)
				   VALUES (${user.id}, ${id}, ${prompt})`
	)
}

export default addImageCompletion
