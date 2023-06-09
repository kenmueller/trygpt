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
					   photo, name, email, points,
					   last_charged AS "lastCharged",
					   prompt_tokens AS "promptTokens",
					   completion_tokens AS "completionTokens",
					   images,
					   purchased_amount AS "purchasedAmount",
					   preview_messages AS "previewMessages",
					   preview_images AS "previewImages",
					   admin,
					   created, updated
				   FROM users
				   WHERE payment_method IS NOT NULL`
	)) as User[]

	return users
}

export default allPayingUsers
