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
					   photo, name, email, tokens,
					   purchased_tokens AS "purchasedTokens",
					   subscription_id AS "subscriptionId",
					   subscription_status AS "subscriptionStatus",
					   created, updated
				   FROM users
				   WHERE customer_id = ${customerId}`
	)) as User[]

	return (users[0] as User | undefined) ?? null
}

export default userFromCustomerId
