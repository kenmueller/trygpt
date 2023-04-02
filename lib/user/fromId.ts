import 'server-only'

import { cache } from 'react'
import { sql, DatabasePoolConnection } from 'slonik'

import { connect } from '@/lib/pool'
import User from '.'

const _userFromId = (id: string, connection?: DatabasePoolConnection) =>
	connection
		? userFromIdWithConnection(id, connection)
		: connect(connection => userFromIdWithConnection(id, connection))

const userFromIdWithConnection = async (
	id: string,
	connection: DatabasePoolConnection
) => {
	const users: readonly User[] = await connection.any(
		sql.unsafe`SELECT *
				   FROM users
				   WHERE id = ${id}
				   LIMIT 1`
	)

	return (users[0] as User | undefined) ?? null
}

const userFromId = cache(_userFromId)

export default userFromId
