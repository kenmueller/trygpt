import 'server-only'

if (!process.env.DATABASE_URL) throw new Error('Missing DATABASE_URL')

import { createPool, ConnectionRoutine } from 'slonik'

const pool = createPool(process.env.DATABASE_URL, {
	ssl: { rejectUnauthorized: false }
})

export const connect = async <T>(connectionRoutine: ConnectionRoutine<T>) =>
	(await pool).connect(connectionRoutine)

export default pool
