import { pgEnum } from 'drizzle-orm/pg-core';
import { Roles } from '../permissions/enum/roles';

export const roleEnum = pgEnum(
  'roles',
  Object.values(Roles) as [string, ...string[]],
);
