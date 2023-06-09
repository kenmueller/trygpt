import { sql, DatabasePoolConnection } from 'slonik'
import { nanoid } from 'nanoid'
import { convert as createSlug } from 'url-slug'

import User from '@/lib/user'
import { connect } from '@/lib/pool'
import truncate from '@/lib/truncate'

export interface CreateConversationData {
	chatId: string
	chatName: string | null
	title: string
	text: string
}

const createConversation = (
	user: User,
	data: CreateConversationData,
	connection?: DatabasePoolConnection
) =>
	connection
		? createConversationWithConnection(user, data, connection)
		: connect(connection =>
				createConversationWithConnection(user, data, connection)
		  )

const createConversationWithConnection = async (
	user: User,
	{ chatId, chatName, title, text }: CreateConversationData,
	connection: DatabasePoolConnection
) => {
	const id = nanoid()
	const slug = truncate(createSlug(title || chatName || 'Untitled'), 50)

	await connection.query(
		sql.unsafe`INSERT INTO
				   conversations (user_id, chat_id, id, slug, title, text)
				   VALUES (${user.id}, ${chatId}, ${id}, ${slug}, ${title}, ${text})`
	)

	return { id, slug }
}

export default createConversation
