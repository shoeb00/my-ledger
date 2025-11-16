export enum Roles {
  AUTHOR = 'author',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

export const ROLE_RANK: Record<Roles, number> = {
  author: 30,
  editor: 20,
  viewer: 10,
};
