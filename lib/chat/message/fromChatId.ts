import 'server-only'

import { cache } from 'react'
import { sql, DatabasePoolConnection } from 'slonik'

import { connect } from '@/lib/pool'
import ChatMessage from '.'

const chatMessagesFromChatId = cache(
	(chatId: string, connection?: DatabasePoolConnection) =>
		connection
			? chatMessagesFromChatIdWithConnection(chatId, connection)
			: connect(connection =>
					chatMessagesFromChatIdWithConnection(chatId, connection)
			  )
)

const chatMessagesFromChatIdWithConnection = async (
	chatId: string,
	connection: DatabasePoolConnection
) => {
	const chats: readonly ChatMessage[] = await connection.any(
		sql.unsafe`SELECT chat_id AS "chatId", id, role, text, created
				   FROM chat_messages
				   WHERE chat_id = ${chatId}
				   ORDER BY created ASC`
	)

	return chats as ChatMessage[]
}

export default chatMessagesFromChatId
