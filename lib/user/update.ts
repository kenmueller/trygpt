import 'server-only'

import { sql, DatabasePoolConnection } from 'slonik'

import { connect } from '@/lib/pool'
import isObjectEmpty from '@/lib/isObjectEmpty'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'

export interface UpdateUserData {
	incrementTokens?: number
	purchasedTokens?: number
}

const updateUser = async (
	id: string,
	data: UpdateUserData,
	connection?: DatabasePoolConnection
) => {
	if (isObjectEmpty(data))
		throw new HttpError(ErrorCode.Internal, 'No data passed to updateUser')

	await (connection
		? updateUserWithConnection(id, data, connection)
		: connect(connection => updateUserWithConnection(id, data, connection)))
}

const updateUserWithConnection = async (
	id: string,
	{ incrementTokens, purchasedTokens }: UpdateUserData,
	connection: DatabasePoolConnection
) => {
	await connection.query(
		sql.unsafe`UPDATE users
				   SET ${sql.join(
							[
								incrementTokens !== undefined &&
									sql.unsafe`tokens = tokens + ${incrementTokens}`,
								purchasedTokens !== undefined &&
									sql.unsafe`purchased_tokens = ${purchasedTokens}`
							].filter(Boolean) as ReturnType<typeof sql.unsafe>[],
							sql.fragment`, `
						)}
				   WHERE id = ${id}`
	)
}

export default updateUser
