import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import type { UserResponseDto } from '../user/dto/user-response';
import { PermissionsResponse } from '../permissions/dto/permissions-response';

type Store = {
  user?: UserResponseDto;
  permissions?: PermissionsResponse;
  [k: string]: unknown;
};

@Injectable()
export class RequestContextService {
  private als = new AsyncLocalStorage<Store>();

  run(next: (...args: any[]) => unknown) {
    this.als.run({}, next);
  }

  set(key: string, value: unknown) {
    const store = this.als.getStore();
    if (store) store[key] = value;
  }

  get<T = unknown>(key: string): T | undefined {
    const store = this.als.getStore();
    return store ? (store[key] as T | undefined) : undefined;
  }

  setUser(user: UserResponseDto) {
    this.set('user', user);
  }

  getUser(): UserResponseDto {
    const user = this.get<UserResponseDto>('user');
    if (!user) throw new Error('User not found in request context');
    return user;
  }

  setPermissions(permissions: PermissionsResponse) {
    this.set('permissions', permissions);
  }

  getPermissions(): PermissionsResponse {
    const permissions = this.get<PermissionsResponse>('permissions');
    if (!permissions)
      throw new Error('Permissions not found in request context');
    return permissions;
  }
}
