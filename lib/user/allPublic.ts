import { cache } from 'react'
import { sql, DatabasePoolConnection } from 'slonik'

import { connect } from '@/lib/pool'
import { PublicUser } from '.'

/** Sorted by points. */
const allPublicUsers = cache(
	(limit?: number, connection?: DatabasePoolConnection) =>
		connection
			? allPublicUsersWithConnection(limit, connection)
			: connect(connection => allPublicUsersWithConnection(limit, connection))
)

const allPublicUsersWithConnection = async (
	limit: number | undefined,
	connection: DatabasePoolConnection
) => {
	const users = (await connection.any(
		sql.unsafe`SELECT
					   id,
					   photo, name, points,
					   admin,
					   created, updated
				   FROM users
				   ORDER BY points DESC
				   ${limit ? sql.unsafe`LIMIT ${limit}` : sql.unsafe``}`
	)) as PublicUser[]

	return users
}

export default allPublicUsers
