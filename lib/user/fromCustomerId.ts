import { cache } from 'react'
import { sql, DatabasePoolConnection } from 'slonik'

import { connect } from '@/lib/pool'
import User from '.'

const userFromCustomerId = cache(
	(customerId: string, connection?: DatabasePoolConnection) =>
		connection
			? userFromCustomerIdWithConnection(customerId, connection)
			: connect(connection =>
					userFromCustomerIdWithConnection(customerId, connection)
			  )
)

const userFromCustomerIdWithConnection = async (
	customerId: string,
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
					   purchased_amount AS "purchasedAmount",
					   preview_messages AS "previewMessages",
					   preview_images AS "previewImages",
					   admin,
					   created, updated
				   FROM users
				   WHERE customer_id = ${customerId}`
	)) as User[]

	return (users[0] as User | undefined) ?? null
}

export default userFromCustomerId
