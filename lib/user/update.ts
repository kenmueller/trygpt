import 'server-only'

import { sql, DatabasePoolConnection } from 'slonik'

import { connect } from '@/lib/pool'
import isObjectEmpty from '@/lib/isObjectEmpty'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'

export interface UpdateUserData {
	paymentMethod?: string
	lastCharged?: 'now'
	incrementRequestTokens?: number
	incrementResponseTokens?: number
	incrementPurchasedAmount?: number
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
	{
		paymentMethod,
		lastCharged,
		incrementRequestTokens,
		incrementResponseTokens,
		incrementPurchasedAmount
	}: UpdateUserData,
	connection: DatabasePoolConnection
) => {
	await connection.query(
		sql.unsafe`UPDATE users
				   SET ${sql.join(
							[
								paymentMethod !== undefined &&
									sql.unsafe`payment_method = ${paymentMethod}`,
								lastCharged !== undefined && sql.unsafe`last_charged = NOW()`,
								incrementRequestTokens !== undefined &&
									sql.unsafe`request_tokens = request_tokens + ${incrementRequestTokens}`,
								incrementResponseTokens !== undefined &&
									sql.unsafe`response_tokens = response_tokens + ${incrementResponseTokens}`,
								incrementPurchasedAmount !== undefined &&
									sql.unsafe`purchased_amount = purchased_amount + ${incrementPurchasedAmount}`
							].filter(Boolean) as ReturnType<typeof sql.unsafe>[],
							sql.fragment`, `
						)}
				   WHERE id = ${id}`
	)
}

export default updateUser
