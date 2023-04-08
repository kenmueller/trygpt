import 'server-only'

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
					   photo, name, email,
					   last_billed AS "lastBilled",
					   request_tokens AS "requestTokens",
					   response_tokens AS "responseTokens",
					   purchased_amount AS "purchasedAmount",
					   created, updated
				   FROM users
				   WHERE customer_id = ${customerId}`
	)) as User[]

	return (users[0] as User | undefined) ?? null
}

export default userFromCustomerId
