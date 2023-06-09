import { sql, DatabasePoolConnection } from 'slonik'

import { connect } from '@/lib/pool'
import isObjectEmpty from '@/lib/isObjectEmpty'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'

export interface UpdateUserData {
	paymentMethod?: string | null
	lastCharged?: 'now'
	incrementPromptTokens?: number
	incrementCompletionTokens?: number
	incrementImages?: number
	incrementPurchasedAmount?: number
	incrementPreviewMessages?: number
	incrementPreviewImages?: number
	incrementPoints?: number
	updated?: 'now'
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
		incrementPromptTokens,
		incrementCompletionTokens,
		incrementImages,
		incrementPurchasedAmount,
		incrementPreviewMessages,
		incrementPreviewImages,
		incrementPoints,
		updated
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
								incrementPromptTokens !== undefined &&
									sql.unsafe`prompt_tokens = prompt_tokens + ${incrementPromptTokens}`,
								incrementCompletionTokens !== undefined &&
									sql.unsafe`completion_tokens = completion_tokens + ${incrementCompletionTokens}`,
								incrementImages !== undefined &&
									sql.unsafe`images = images + ${incrementImages}`,
								incrementPurchasedAmount !== undefined &&
									sql.unsafe`purchased_amount = purchased_amount + ${incrementPurchasedAmount}`,
								incrementPreviewMessages !== undefined &&
									sql.unsafe`preview_messages = preview_messages + ${incrementPreviewMessages}`,
								incrementPreviewImages !== undefined &&
									sql.unsafe`preview_images = preview_images + ${incrementPreviewImages}`,
								incrementPoints !== undefined &&
									sql.unsafe`points = points + ${incrementPoints}`,
								updated !== undefined && sql.unsafe`updated = NOW()`
							].filter(Boolean) as ReturnType<typeof sql.unsafe>[],
							sql.fragment`, `
						)}
				   WHERE id = ${id}`
	)
}

export default updateUser
