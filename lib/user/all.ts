import { cache } from 'react'
import { sql, DatabasePoolConnection } from 'slonik'

import { connect } from '@/lib/pool'
import User from '.'

const allUsers = cache((connection?: DatabasePoolConnection) =>
	connection
		? allUsersWithConnection(connection)
		: connect(connection => allUsersWithConnection(connection))
)

const allUsersWithConnection = async (connection: DatabasePoolConnection) => {
	const users = (await connection.any(
		sql.unsafe`SELECT
				       id,
					   customer_id AS "customerId",
					   payment_method AS "paymentMethod",
					   photo, name, email, points,
					   last_charged AS "lastCharged",
					   prompt_tokens AS "requestTokens",
					   completion_tokens AS "responseTokens",
					   purchased_amount AS "purchasedAmount",
					   preview_messages AS "previewMessages",
					   admin,
					   created, updated
				   FROM users`
	)) as User[]

	return users
}

export default allUsers
