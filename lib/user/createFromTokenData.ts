import 'server-only'

import { DatabasePoolConnection, sql } from 'slonik'

import UserTokenData from './tokenData'
import { connect } from '@/lib/pool'

/** If the user already exists, nothing happens. */
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
	await connection.query(
		sql.unsafe`INSERT INTO
				   users (id, photo, name, email)
				   VALUES (${id}, ${photo}, ${name}, ${email})
				   ON CONFLICT (id) DO NOTHING`
	)
}

export default createUserFromTokenData
