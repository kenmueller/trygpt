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
		sql.unsafe`SELECT
				       id,
					   customer_id AS "customerId",
					   photo, name, email,
					   billing_start_time AS "billingStartTime",
					   total_tokens AS "totalTokens",
					   purchased_tokens AS "purchasedTokens",
					   created, updated
				   FROM users
				   WHERE id = ${id}`
	)) as User[]

	return (users[0] as User | undefined) ?? null
}

export default userFromId
