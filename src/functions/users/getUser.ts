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
 * /users/{userId}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get a user by ID
 *     description: Get a user by ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: String ID of the user to get
 *     responses:
 *       '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/User'
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: User Not Found
 *       '500':
 *         description: Internal Server Error
 */
export async function getUser(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  const id = request.params.id;

  if (!id)
    return {
      status: 400,
      body: 'Please pass a user ID on the path. Ex: /users/{id}',
    };

  const cosmosClient = CosmosContainerSingleton.getInstance();

  const query = {
    query: 'SELECT * FROM Users WHERE Users.id = @id',
    parameters: [{ name: '@id', value: id }],
  };

  try {
    const { resources: results }: { resources: User[] } = await cosmosClient
      .container('Users')
      .items.query(query)
      .fetchAll();

    return results.length
      ? { jsonBody: userDto(results[0]), status: 200 }
      : { status: 404, body: `User not found.` };
  } catch (error) {
    context.error(error);
    return { status: 500 };
  }
}

app.http('user', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: getUser,
  route: 'users/{id}',
});
