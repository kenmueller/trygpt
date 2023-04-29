import { cache } from 'react'
import { sql, DatabasePoolConnection } from 'slonik'

import { connect } from '@/lib/pool'
import User from '.'

/** All users that have been charged before. */
const allPayingUsers = cache((connection?: DatabasePoolConnection) =>
	connection
		? allPayingUsersWithConnection(connection)
		: connect(connection => allPayingUsersWithConnection(connection))
)

const allPayingUsersWithConnection = async (
	connection: DatabasePoolConnection
) => {
	const users = (await connection.any(
		sql.unsafe`SELECT
				       id,
					   customer_id AS "customerId",
					   payment_method AS "paymentMethod",
					   photo, name, email,
					   last_charged AS "lastCharged",
					   prompt_tokens AS "requestTokens",
					   completion_tokens AS "responseTokens",
					   purchased_amount AS "purchasedAmount",
					   preview_messages AS "previewMessages",
					   created, updated
				   FROM users
				   WHERE purchased_amount > 0`
	)) as User[]

	return users
}

export default allPayingUsers
