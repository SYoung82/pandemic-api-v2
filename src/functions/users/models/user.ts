export type User = {
  id: string;
  name: string;
  games: unknown[];
};

export function userDto(user: User): User {
  return {
    id: user.id,
    name: user.name,
    games: user.games,
  };
}
