import 'server-only'

import { cache } from 'react'
import { sql, DatabasePoolConnection } from 'slonik'

import { connect } from '@/lib/pool'
import User from '.'

const userFromId = cache((id: string, connection?: DatabasePoolConnection) =>
	connection
		? userFromIdWithConnection(id, connection)
		: connect(connection => userFromIdWithConnection(id, connection))
)

const userFromIdWithConnection = async (
	id: string,
	connection: DatabasePoolConnection
) => {
	const users = (await connection.any(
		sql.unsafe`SELECT id, photo, name, email, created, updated
				   FROM users
				   WHERE id = ${id}`
	)) as User[]

	return (users[0] as User | undefined) ?? null
}

export default userFromId
