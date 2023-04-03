import 'server-only'

import { DatabasePoolConnection, sql } from 'slonik'

import UserTokenData from './tokenData'
import { connect } from '@/lib/pool'

/** If the user already exists, nothing happens. */
const createUserFromTokenData = (
	tokenData: UserTokenData,
	doNothingIfExists = true,
	connection?: DatabasePoolConnection
) =>
	connection
		? createUserFromTokenDataWithConnection(
				tokenData,
				doNothingIfExists,
				connection
		  )
		: connect(connection =>
				createUserFromTokenDataWithConnection(
					tokenData,
					doNothingIfExists,
					connection
				)
		  )

const createUserFromTokenDataWithConnection = async (
	{ id, photo, name, email }: UserTokenData,
	doNothingIfExists: boolean,
	connection: DatabasePoolConnection
) => {
	await connection.query(
		sql.unsafe`INSERT INTO
				   users (id, photo, name, email)
				   VALUES (${id}, ${photo}, ${name}, ${email})
				   ${
							doNothingIfExists
								? sql.fragment`ON CONFLICT (id) DO NOTHING`
								: sql.fragment``
						}`
	)
}

export default createUserFromTokenData
