import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from './schema/index.js'

export const createDb = (pool: Pool) => {
    return drizzle(pool, { schema, casing: 'snake_case' })
}

export type DB = NodePgDatabase<typeof schema> & { $client: Pool };
