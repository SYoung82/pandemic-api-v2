import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import { CosmosContainerSingleton } from '../../clients/cosmosClient';
import { User, userDto } from './models/user';

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

    return { body: JSON.stringify(results.map(userDto)), status: 200 };
  } catch (error) {
    context.error(error);
    return { status: 500 };
  }
}

app.http('getUsers', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: getUsers,
});
