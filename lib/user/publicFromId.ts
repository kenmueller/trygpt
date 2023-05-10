import { cache } from 'react'
import { sql, DatabasePoolConnection } from 'slonik'

import { connect } from '@/lib/pool'
import { PublicUser } from '.'

const publicUserFromId = cache(
	(id: string, connection?: DatabasePoolConnection) =>
		connection
			? publicUserFromIdWithConnection(id, connection)
			: connect(connection => publicUserFromIdWithConnection(id, connection))
)

const publicUserFromIdWithConnection = async (
	id: string,
	connection: DatabasePoolConnection
) => {
	const users = (await connection.any(
		sql.unsafe`SELECT
				       id,
					   photo, name, points,
					   admin,
					   created, updated
				   FROM users
				   WHERE id = ${id}`
	)) as PublicUser[]

	return (users[0] as PublicUser | undefined) ?? null
}

export default publicUserFromId
