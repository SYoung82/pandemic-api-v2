import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import { CosmosContainerSingleton } from '../../clients/cosmosClient';
import { User, userDto } from './models/user';

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     description: Get all users
 *     responses:
 *       '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/definitions/User'
 *        '500':
 *          description: Internal Server Error
 */
export async function getUsers(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);
  const cosmosClient = CosmosContainerSingleton.getInstance();

  const query = {
    query: 'SELECT * FROM Users',
  };

  try {
    const { resources: results }: { resources: User[] } = await cosmosClient
      .container('Users')
      .items.query(query)
      .fetchAll();

    return { jsonBody: results.map(userDto), status: 200 };
  } catch (error) {
    context.error(error);
    return { status: 500 };
  }
}

app.http('users', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: getUsers,
});
