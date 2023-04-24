/**
 * @swagger
 * definitions:
 *   User:
 *     properties:
 *       id:
 *         type: string
 *       name:
 *         type: string
 *       games:
 *         type: array
 *         items:
 *           description: networkIds
 *           type: string
 */
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
