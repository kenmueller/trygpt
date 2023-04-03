import 'server-only'

import { sql, DatabasePoolConnection } from 'slonik'
import { nanoid } from 'nanoid'

import { connect } from '@/lib/pool'
import ChatMessage from '.'

export type CreateChatMessageData = Pick<
	ChatMessage,
	'chatId' | 'role' | 'text'
>

const createChatMessage = (
	message: CreateChatMessageData,
	connection?: DatabasePoolConnection
) =>
	connection
		? createChatMessageWithConnection(message, connection)
		: connect(connection =>
				createChatMessageWithConnection(message, connection)
		  )

const createChatMessageWithConnection = async (
	{ chatId, role, text }: CreateChatMessageData,
	connection: DatabasePoolConnection
) => {
	const id = nanoid()

	await connection.query(
		sql.unsafe`INSERT INTO
				   chat_messages (chat_id, id, role, text)
				   VALUES (${chatId}, ${id}, ${role}, ${text})`
	)

	return id
}

export default createChatMessage
