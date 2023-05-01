import { DatabasePoolConnection, sql } from 'slonik'

import UserTokenData from './tokenData'
import { connect } from '@/lib/pool'
import stripe from '@/lib/stripe'

const createUserFromTokenData = (
	tokenData: UserTokenData,
	connection?: DatabasePoolConnection
) =>
	connection
		? createUserFromTokenDataWithConnection(tokenData, connection)
		: connect(connection =>
				createUserFromTokenDataWithConnection(tokenData, connection)
		  )

const createUserFromTokenDataWithConnection = async (
	{ id, photo, name, email }: UserTokenData,
	connection: DatabasePoolConnection
) => {
	await connection.transaction(async connection => {
		await connection.query(
			sql.unsafe`INSERT INTO
				   users (id, photo, name, email)
				   VALUES (${id}, ${photo}, ${name}, ${email})`
		)

		const { id: customerId } = await stripe.customers.create({ name, email })

		await connection.query(
			sql.unsafe`UPDATE users
					   SET customer_id = ${customerId}
					   WHERE id = ${id}`
		)
	})
}

export default createUserFromTokenData
