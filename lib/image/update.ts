import { sql, DatabasePoolConnection } from 'slonik'

import { connect } from '@/lib/pool'

export interface UpdateImageCompletionData {
	visible?: false
	updated?: 'now'
}

const updateImageCompletion = (
	id: string,
	data: UpdateImageCompletionData,
	connection?: DatabasePoolConnection
) =>
	connection
		? updateImageCompletionWithConnection(id, data, connection)
		: connect(connection =>
				updateImageCompletionWithConnection(id, data, connection)
		  )

const updateImageCompletionWithConnection = async (
	id: string,
	{ visible, updated }: UpdateImageCompletionData,
	connection: DatabasePoolConnection
) => {
	await connection.query(
		sql.unsafe`UPDATE images
				   SET ${sql.join(
							[
								visible !== undefined && sql.unsafe`visible = ${visible}`,
								updated !== undefined && sql.unsafe`updated = NOW()`
							].filter(Boolean) as ReturnType<typeof sql.unsafe>[],
							sql.fragment`, `
						)}
				   WHERE id = ${id} AND visible`
	)
}

export default updateImageCompletion
