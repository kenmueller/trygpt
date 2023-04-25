import { sql, DatabasePoolConnection } from 'slonik'
import { nanoid } from 'nanoid'

import { connect } from '@/lib/pool'
import ChatMessage from '.'

export type CreateChatMessageData = Pick<
	ChatMessage,
	'chatId' | 'role' | 'text'
>

const createChatMessages = (
	messages: CreateChatMessageData[],
	connection?: DatabasePoolConnection
) =>
	connection
		? createChatMessagesWithConnection(messages, connection)
		: connect(connection =>
				createChatMessagesWithConnection(messages, connection)
		  )

const createChatMessagesWithConnection = async (
	messages: CreateChatMessageData[],
	connection: DatabasePoolConnection
) => {
	await connection.query(
		sql.unsafe`INSERT INTO
				   chat_messages (chat_id, id, role, text)
				   VALUES ${sql.join(
							messages.map(
								({ chatId, role, text }) =>
									sql.unsafe`(${chatId}, ${nanoid()}, ${role}, ${text})`
							),
							sql.fragment`, `
						)}
				   ON CONFLICT DO NOTHING`
	)
}

export default createChatMessages
