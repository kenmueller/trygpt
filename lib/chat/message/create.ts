import 'server-only'

import { sql, DatabasePoolConnection } from 'slonik'

import { connect } from '@/lib/pool'
import ChatMessage from '.'

export type CreateChatMessageData = Pick<
	ChatMessage,
	'chatId' | 'id' | 'role' | 'text'
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
	{ chatId, id, role, text }: CreateChatMessageData,
	connection: DatabasePoolConnection
) => {
	await connection.query(
		sql.unsafe`INSERT INTO
				   chats (chat_id, id, role, text)
				   VALUES (${chatId}, ${id}, ${role}, ${text})`
	)
}

export default createChatMessage
