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
					   prompt_tokens AS "promptTokens",
					   completion_tokens AS "completionTokens",
					   images,
					   purchased_amount AS "purchasedAmount",
					   preview_messages AS "previewMessages",
					   preview_images AS "previewImages",
					   admin,
					   created, updated
				   FROM users`
	)) as User[]

	return users
}

export default allUsers
