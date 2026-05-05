import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from './schema/index.js'

export const createDb = (pool: Pool) => {
    return drizzle(pool, { schema, casing: 'snake_case' })
}

export type DB = ReturnType<typeof createDb>;
