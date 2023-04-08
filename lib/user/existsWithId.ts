import 'server-only'

import { cache } from 'react'
import { sql, DatabasePoolConnection } from 'slonik'

import { connect } from '@/lib/pool'

const userExistsWithId = cache(
	(id: string, connection?: DatabasePoolConnection) =>
		connection
			? userExistsWithIdWithConnection(id, connection)
			: connect(connection => userExistsWithIdWithConnection(id, connection))
)

const userExistsWithIdWithConnection = async (
	id: string,
	connection: DatabasePoolConnection
) => {
	const [{ exists }] = (await connection.any(
		sql.unsafe`SELECT EXISTS(
				      SELECT 1
					  FROM users
					  WHERE id = ${id}
				   )`
	)) as [{ exists: boolean }]

	return exists
}

export default userExistsWithId
